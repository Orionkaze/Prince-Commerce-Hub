import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { completeMultipartUpload, abortMultipartUpload } from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { key, uploadId, parts } = body;

    if (!key || !uploadId || !Array.isArray(parts)) {
      return NextResponse.json(
        { error: "key, uploadId, and parts array are required." },
        { status: 400 }
      );
    }

    const result = await completeMultipartUpload({
      key,
      uploadId,
      parts,
    });

    return NextResponse.json({ success: true, key, result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to complete multipart upload" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { key, uploadId } = body;

    if (!key || !uploadId) {
      return NextResponse.json(
        { error: "key and uploadId are required" },
        { status: 400 }
      );
    }

    await abortMultipartUpload({ key, uploadId });
    return NextResponse.json({ success: true, aborted: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to abort multipart upload" },
      { status: 500 }
    );
  }
}
