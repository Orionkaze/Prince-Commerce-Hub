import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { buildR2ObjectKey, r2Client, isR2Configured } from "@/lib/storage/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin privileges
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    if (!isR2Configured) {
      return NextResponse.json(
        { error: "Cloudflare R2 storage is not configured on this environment." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const fileCategory = (formData.get("fileCategory") as string) || "other";
    const courseId = (formData.get("courseId") as string) || undefined;
    const moduleId = (formData.get("moduleId") as string) || undefined;
    const lectureId = (formData.get("lectureId") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file was attached to upload." }, { status: 400 });
    }

    const filename = file.name;
    const contentType = file.type || "application/octet-stream";

    // 2. Build structured R2 object key
    let cat: "video" | "pdf" | "thumbnail" | "assignment" | "other" = "other";
    if (fileCategory === "video" || file.type.startsWith("video/")) {
      cat = "video";
    } else if (fileCategory === "thumbnail" || file.type.startsWith("image/")) {
      cat = "thumbnail";
    } else if (fileCategory === "assignment") {
      cat = "assignment";
    } else {
      cat = "pdf";
    }

    const objectKey = buildR2ObjectKey({
      contentType: cat,
      filename,
      courseId,
      moduleId,
      lectureId,
    });

    // 3. Convert file to buffer and execute PutObject directly (server-to-R2, immune to browser CORS)
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucketName =
      process.env.R2_BUCKET_NAME ||
      process.env.CLOUDFLARE_R2_BUCKET_NAME ||
      "prime-commerce-storage";

    await r2Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return NextResponse.json({
      success: true,
      key: objectKey,
      filename,
    });
  } catch (error: any) {
    console.error("Direct server upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file to Cloudflare R2 storage." },
      { status: 500 }
    );
  }
}
