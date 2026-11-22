import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";


export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ purchases: [], enrolledCourses: [], unlockedLectures: [] });
    }

    const supabase = await createClient();

    // Fetch purchases for this student
    const { data: purchases, error } = await supabase
      .from("purchases")
      .select("*, courses(*), lectures(*)")
      .eq("student_id", user.id)
      .eq("payment_status", "completed")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const enrolledCourseIds = (purchases || [])
      .map((p) => p.course_id)
      .filter(Boolean);

    const purchasedLectureIds = (purchases || [])
      .map((p) => p.lecture_id)
      .filter(Boolean);

    return NextResponse.json({
      success: true,
      purchases: purchases || [],
      enrolledCourseIds,
      purchasedLectureIds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch student purchases" },
      { status: 500 }
    );
  }
}
