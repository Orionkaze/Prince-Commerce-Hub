import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { verifyObjectExists } from "@/lib/storage/r2";


export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: "key is required" }, { status: 400 });
    }

    const verification = await verifyObjectExists(key);
    return NextResponse.json({ success: true, ...verification });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to verify object" },
      { status: 500 }
    );
  }
}
