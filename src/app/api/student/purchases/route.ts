import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";


export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({
        enrolledCourseIds: [],
        purchasedLectureIds: [],
        purchases: [],
      });
    }

    const supabase = createAdminClient();

    const enrolledCourseIds: string[] = [];
    const purchasedLectureIds: string[] = [];
    let purchases: any[] = [];

    // 1. Fetch from enrollments table
    const revokedCourseIds = new Set<string>();
    try {
      const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id, status")
        .eq("student_id", user.id);

      if (enrollments) {
        enrollments.forEach((e) => {
          if (e.status === "active") {
            if (!enrolledCourseIds.includes(e.course_id)) {
              enrolledCourseIds.push(e.course_id);
            }
          } else if (e.status === "revoked" || e.status === "cancelled" || e.status === "expired") {
            revokedCourseIds.add(e.course_id);
          }
        });
      }
    } catch {
      // ignore
    }

    // 2. Fetch from purchases table (exclude revoked)
    try {
      const { data: pData } = await supabase
        .from("purchases")
        .select("*")
        .eq("student_id", user.id)
        .eq("payment_status", "completed");

      if (pData) {
        purchases = pData;
        pData.forEach((p) => {
          if (p.course_id && !enrolledCourseIds.includes(p.course_id) && !revokedCourseIds.has(p.course_id)) {
            enrolledCourseIds.push(p.course_id);
          }
          if (p.lecture_id && !purchasedLectureIds.includes(p.lecture_id)) {
            purchasedLectureIds.push(p.lecture_id);
          }
        });
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      enrolledCourseIds,
      purchasedLectureIds,
      purchases,
    });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    return NextResponse.json(
      { error: error?.message || "Failed to fetch student purchases" },
      { status: 500 }
    );
  }
}
