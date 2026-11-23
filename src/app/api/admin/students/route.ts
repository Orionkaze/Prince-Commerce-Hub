import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { getStudentsList } from "@/services/enrollments";


export async function GET() {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const students = await getStudentsList();
    return NextResponse.json({ students });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load students" },
      { status: 500 }
    );
  }
}
