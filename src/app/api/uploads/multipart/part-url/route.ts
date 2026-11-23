import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { getMultipartUploadPartUrl } from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { key, uploadId, partNumber } = body;

    if (!key || !uploadId || !partNumber) {
      return NextResponse.json(
        { error: "key, uploadId, and partNumber are required." },
        { status: 400 }
      );
    }

    const { uploadUrl } = await getMultipartUploadPartUrl({
      key,
      uploadId,
      partNumber: Number(partNumber),
    });

    return NextResponse.json({ success: true, uploadUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate part upload URL" },
      { status: 500 }
    );
  }
}
