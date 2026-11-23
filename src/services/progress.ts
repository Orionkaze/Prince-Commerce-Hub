import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseWithCurriculum } from "./courses";

/**
 * Fetch complete dashboard data for a student
 */
export async function getStudentDashboardData(userId: string) {
  const supabase = createAdminClient();

  // 1. Fetch user profile / user role
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  // 2. Fetch student's enrollments & purchases
  let enrolledCourseIds: string[] = [];
  let purchases: any[] = [];

  // A. Check enrollments table
  const revokedCourseIds = new Set<string>();
  try {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("course_id, enrolled_at, status")
      .eq("student_id", userId);

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
    // fallback
  }

  // B. Check purchases table (only if not explicitly revoked)
  try {
    const { data: pData } = await supabase
      .from("purchases")
      .select("*")
      .eq("student_id", userId)
      .eq("payment_status", "completed")
      .order("created_at", { ascending: false });

    if (pData) {
      purchases = pData;
      pData.forEach((p) => {
        if (p.course_id && !enrolledCourseIds.includes(p.course_id) && !revokedCourseIds.has(p.course_id)) {
          enrolledCourseIds.push(p.course_id);
        }
      });
    }
  } catch {
    // fallback
  }

  // 3. Fetch lecture progress records for this student
  let progressRecords: any[] = [];
  try {
    const { data: prog } = await supabase
      .from("lecture_progress")
      .select("*")
      .eq("student_id", userId);

    if (prog) {
      progressRecords = prog;
    }
  } catch {
    // fallback
  }

  const completedLectureIds = new Set(
    progressRecords.filter((p) => p.completed).map((p) => p.lecture_id)
  );

  // 4. Fetch details for each enrolled course with progress calculation
  const enrolledCoursesWithProgress = await Promise.all(
    enrolledCourseIds.map(async (courseId) => {
      const course = await getCourseWithCurriculum(courseId);
      if (!course) return null;

      // Flatten lectures across all modules
      const allLectures: any[] = [];
      course.modules?.forEach((m) => {
        m.lectures?.forEach((l) => allLectures.push(l));
      });

      const totalLectures = allLectures.length || 1;
      const completedCount = allLectures.filter((l) =>
        completedLectureIds.has(l.id)
      ).length;

      const progressPercent = Math.round((completedCount / totalLectures) * 100);

      // Find last watched lecture or first lecture
      let lastWatchedLecture = allLectures[0] || null;
      const studentWatched = progressRecords.filter((p) =>
        allLectures.some((l) => l.id === p.lecture_id)
      );

      if (studentWatched.length > 0) {
        studentWatched.sort(
          (a, b) =>
            new Date(b.last_watched_at).getTime() -
            new Date(a.last_watched_at).getTime()
        );
        const matched = allLectures.find((l) => l.id === studentWatched[0].lecture_id);
        if (matched) lastWatchedLecture = matched;
      }

      return {
        ...course,
        totalLectures,
        completedLectures: completedCount,
        progressPercent,
        isCompleted: completedCount >= totalLectures && totalLectures > 0,
        lastWatchedLecture,
      };
    })
  );

  const validEnrolledCourses = enrolledCoursesWithProgress.filter(Boolean) as any[];

  // Overall Statistics
  const totalEnrolled = validEnrolledCourses.length;
  const completedCoursesCount = validEnrolledCourses.filter(
    (c) => c.isCompleted
  ).length;
  const totalCompletedLectures = completedLectureIds.size;

  const overallProgress =
    totalEnrolled > 0
      ? Math.round(
          validEnrolledCourses.reduce((acc, c) => acc + c.progressPercent, 0) /
            totalEnrolled
        )
      : 0;

  return {
    student: {
      name: userRole?.full_name || "Student",
      email: userRole?.email || "",
      role: userRole?.role || "student",
    },
    stats: {
      totalEnrolled,
      completedCoursesCount,
      totalCompletedLectures,
      overallProgress,
    },
    enrolledCourses: validEnrolledCourses,
    purchases,
    recentProgress: progressRecords.slice(0, 5),
  };
}

/**
 * Save / Update student playback position and completion
 */
export async function saveLectureProgress(params: {
  studentId: string;
  lectureId: string;
  lastPositionSeconds: number;
  completed?: boolean;
}) {
  const supabase = createAdminClient();

  const payload: any = {
    student_id: params.studentId,
    lecture_id: params.lectureId,
    last_position_seconds: Math.round(params.lastPositionSeconds),
    last_watched_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (params.completed !== undefined) {
    payload.completed = params.completed;
  }

  const { data, error } = await supabase
    .from("lecture_progress")
    .upsert(payload, { onConflict: "student_id,lecture_id" })
    .select()
    .single();

  if (error) {
    console.error("Failed to save lecture progress:", error);
    throw error;
  }

  return data;
}

/**
 * Get student's saved progress for a specific lecture
 */
export async function getLectureProgress(studentId: string, lectureId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("lecture_progress")
    .select("*")
    .eq("student_id", studentId)
    .eq("lecture_id", lectureId)
    .maybeSingle();

  if (error || !data) {
    return {
      last_position_seconds: 0,
      completed: false,
    };
  }

  return data;
}
