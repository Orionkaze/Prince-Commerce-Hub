import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { buildR2ObjectKey, createPresignedUploadUrl } from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    // 1. Verify user is admin
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { filename, contentType, fileCategory, subject, courseId, moduleId, lectureId } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and contentType are required" },
        { status: 400 }
      );
    }

    // File validation
    const allowedVideoTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const allowedPdfTypes = ["application/pdf"];
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

    const isVideo = allowedVideoTypes.includes(contentType);
    const isPdf = allowedPdfTypes.includes(contentType);
    const isImage = allowedImageTypes.includes(contentType);

    if (!isVideo && !isPdf && !isImage) {
      return NextResponse.json(
        { error: `Unsupported file type: ${contentType}. Please upload MP4, PDF, or JPG/PNG.` },
        { status: 400 }
      );
    }

    // Build standardized S3 key
    let cat: "video" | "pdf" | "thumbnail" | "assignment" | "other" = "other";
    if (isVideo) cat = "video";
    else if (isPdf) cat = fileCategory === "assignment" ? "assignment" : "pdf";
    else if (isImage) cat = "thumbnail";

    const objectKey = buildR2ObjectKey({
      contentType: cat,
      filename,
      courseId,
      moduleId,
      lectureId,
    });

    const presigned = await createPresignedUploadUrl({
      key: objectKey,
      contentType,
      expiresInSeconds: 3600, // 1 hour window
    });

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      key: presigned.key,
      expiresIn: 3600,
    });
  } catch (error: any) {
    console.error("Presigned URL Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate presigned upload URL" },
      { status: 500 }
    );
  }
}
