import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import {
  initiateMultipartUpload,
  buildR2ObjectKey,
} from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { filename, contentType, courseId, moduleId, lectureId } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "filename and contentType are required" },
        { status: 400 }
      );
    }

    const key = buildR2ObjectKey({
      contentType: "video",
      filename,
      courseId,
      moduleId,
      lectureId,
    });

    const { uploadId } = await initiateMultipartUpload({
      key,
      contentType,
    });

    return NextResponse.json({
      success: true,
      uploadId,
      key,
    });
  } catch (error: any) {
    console.error("Multipart initiate error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate multipart upload" },
      { status: 500 }
    );
  }
}
