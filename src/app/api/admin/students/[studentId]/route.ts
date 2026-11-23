import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import {
  getStudentDetails,
  grantCourseAccess,
  revokeCourseAccess,
} from "@/services/enrollments";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ studentId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { studentId } = await context.params;
    const details = await getStudentDetails(studentId);

    return NextResponse.json({ success: true, ...details });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to load student details" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ studentId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { studentId } = await context.params;
    const body = await req.json();
    const { action, courseId, reason } = body;

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    if (action === "grant") {
      const result = await grantCourseAccess({
        adminId: auth.user!.id,
        studentId,
        courseId,
        reason: reason || "Manual administrator grant",
      });
      return NextResponse.json(result);
    } else if (action === "revoke") {
      const result = await revokeCourseAccess({
        adminId: auth.user!.id,
        studentId,
        courseId,
        reason: reason || "Manual administrator revoke",
      });
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Operation failed" },
      { status: 500 }
    );
  }
}
