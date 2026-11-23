import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import {
  getCourseWithCurriculum,
  updateCourse,
  deleteCourse,
} from "@/services/courses";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { courseId } = await context.params;
    const course = await getCourseWithCurriculum(courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { courseId } = await context.params;
    const updates = await req.json();

    const course = await updateCourse(courseId, updates);
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update course" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { courseId } = await context.params;
    const { searchParams } = req.nextUrl;
    const force = searchParams.get("force") === "true";

    const result = await deleteCourse(courseId, force);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete course" },
      { status: 500 }
    );
  }
}
