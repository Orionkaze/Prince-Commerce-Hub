import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import {
  createCourseModule,
  reorderModules,
} from "@/services/courses";


export async function POST(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { courseId } = await context.params;
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: "Module title is required" }, { status: 400 });
    }

    const moduleRecord = await createCourseModule({
      course_id: courseId,
      title: body.title,
      description: body.description,
      position: body.position,
    });

    return NextResponse.json({ success: true, module: moduleRecord });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create module" },
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
    const body = await req.json();

    if (!Array.isArray(body.moduleIds)) {
      return NextResponse.json({ error: "moduleIds array required" }, { status: 400 });
    }

    const result = await reorderModules(courseId, body.moduleIds);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to reorder modules" },
      { status: 500 }
    );
  }
}
