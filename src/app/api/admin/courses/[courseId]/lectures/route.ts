import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createLecture } from "@/services/courses";
import { createAdminClient } from "@/lib/supabase/admin";

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
      return NextResponse.json({ error: "Lecture title is required." }, { status: 400 });
    }

    // Strictly enforce that the target module belongs to this course
    if (body.module_id) {
      const supabase = createAdminClient();
      try {
        const { data: moduleData } = await supabase
          .from("course_modules")
          .select("id, course_id")
          .eq("id", body.module_id)
          .maybeSingle();

        if (moduleData && moduleData.course_id !== courseId) {
          return NextResponse.json(
            { error: "Invalid module: Specified module does not belong to this course." },
            { status: 400 }
          );
        }
      } catch {
        // fallback if table is virtualized
      }
    }

    const lecture = await createLecture({
      ...body,
      course_id: courseId,
    });

    return NextResponse.json({ success: true, lecture });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create lecture" },
      { status: 500 }
    );
  }
}
