import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, verifyStudentAccess } from "@/lib/auth/roles";
import { getCourseWithCurriculum } from "@/services/courses";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await context.params;
    const user = await getAuthenticatedUser();

    // 1. Check student authentication
    if (!user) {
      if (process.env.NODE_ENV === "development") {
        const course = await getCourseWithCurriculum(courseId);
        if (course) return NextResponse.json({ success: true, course });
      }
      return NextResponse.json(
        { error: "Authentication required to view course content.", requiresAuth: true },
        { status: 401 }
      );
    }

    // 2. Verify student has active enrollment for this specific course
    let hasAccess = await verifyStudentAccess({
      userId: user.id,
      userEmail: user.email,
      courseId,
    });

    if (!hasAccess && process.env.NODE_ENV === "development") {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "You are not enrolled in this course.",
          requiresPurchase: true,
          courseId,
        },
        { status: 403 }
      );
    }

    // 3. Fetch course curriculum strictly scoped to this courseId
    const course = await getCourseWithCurriculum(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    return NextResponse.json(
      { error: error?.message || "Failed to load course curriculum." },
      { status: 500 }
    );
  }
}
