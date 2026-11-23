import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import {
  createPresignedUploadUrl,
  buildR2ObjectKey,
  isR2Configured,
} from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { contentType, filename, courseId, moduleId, lectureId } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required." },
        { status: 400 }
      );
    }

    // Determine content category
    let type: "video" | "pdf" | "thumbnail" | "assignment" | "other" = "other";
    const lowerType = contentType.toLowerCase();
    if (lowerType.startsWith("video/")) {
      type = "video";
    } else if (lowerType.includes("pdf")) {
      type = "pdf";
    } else if (lowerType.startsWith("image/")) {
      type = "thumbnail";
    }

    const key = buildR2ObjectKey({
      contentType: type,
      filename,
      courseId,
      moduleId,
      lectureId,
    });

    const { uploadUrl } = await createPresignedUploadUrl({
      key,
      contentType,
      expiresInSeconds: 3600, // 1 hour valid upload window
    });

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      isR2Configured,
      expiresInSeconds: 3600,
    });
  } catch (error: any) {
    console.error("Presigned URL error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
