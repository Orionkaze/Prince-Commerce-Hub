import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { updateLecture, deleteLecture } from "@/services/courses";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ lectureId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { lectureId } = await context.params;
    const updates = await req.json();

    // If updating module_id, verify that the module belongs to this lecture's course
    if (updates.module_id) {
      const supabase = createAdminClient();
      try {
        const { data: lectureData } = await supabase
          .from("lectures")
          .select("course_id")
          .eq("id", lectureId)
          .maybeSingle();

        if (lectureData?.course_id) {
          const { data: moduleData } = await supabase
            .from("course_modules")
            .select("id, course_id")
            .eq("id", updates.module_id)
            .maybeSingle();

          if (moduleData && moduleData.course_id !== lectureData.course_id) {
            return NextResponse.json(
              { error: "Invalid module: Specified module does not belong to this course." },
              { status: 400 }
            );
          }
        }
      } catch {
        // fallback if table is virtualized
      }
    }

    const updated = await updateLecture(lectureId, updates);
    return NextResponse.json({ success: true, lecture: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update lecture" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ lectureId: string }> }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { lectureId } = await context.params;
    const result = await deleteLecture(lectureId);

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete lecture" },
      { status: 500 }
    );
  }
}
