import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { updateCourseModule, deleteCourseModule } from "@/services/courses";


export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ moduleId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { moduleId } = await context.params;
    const updates = await req.json();

    const updated = await updateCourseModule(moduleId, updates);
    return NextResponse.json({ success: true, module: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update module" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ moduleId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { moduleId } = await context.params;
    const result = await deleteCourseModule(moduleId);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete module" },
      { status: 500 }
    );
  }
}
