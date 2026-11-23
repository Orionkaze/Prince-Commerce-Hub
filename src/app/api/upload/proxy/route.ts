import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { r2Client, isR2Configured, buildR2ObjectKey } from "@/lib/storage/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME ||
  process.env.CLOUDFLARE_R2_BUCKET_NAME ||
  "prime-commerce-storage";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    let key = (formData.get("key") as string) || "";
    const fileCategory = (formData.get("fileCategory") as string) || "other";
    const courseId = (formData.get("courseId") as string) || undefined;
    const moduleId = (formData.get("moduleId") as string) || undefined;
    const lectureId = (formData.get("lectureId") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!key) {
      let cat: "video" | "pdf" | "thumbnail" | "assignment" | "other" = "other";
      if (fileCategory === "video" || file.type.startsWith("video/")) cat = "video";
      else if (fileCategory === "pdf" || file.type.includes("pdf")) cat = "pdf";
      else if (fileCategory === "thumbnail" || file.type.startsWith("image/")) cat = "thumbnail";

      key = buildR2ObjectKey({
        contentType: cat,
        filename: file.name,
        courseId,
        moduleId,
        lectureId,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (isR2Configured) {
      const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
      });

      await r2Client.send(command);
    }

    return NextResponse.json({
      success: true,
      key,
      size: buffer.length,
    });
  } catch (error: any) {
    console.error("Proxy upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload file via server proxy" },
      { status: 500 }
    );
  }
}
