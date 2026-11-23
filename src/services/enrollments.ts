import { createAdminClient } from "@/lib/supabase/admin";
import { EnrollmentRecord, PurchaseRecord, ProfileRecord } from "@/types/lms";

/**
 * Fetch all registered students along with their enrollments count
 */
export async function getStudentsList() {
  const supabase = createAdminClient();

  // 1. Fetch student user roles
  const { data: users, error } = await supabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !users) {
    return [];
  }

  // 2. Fetch all active enrollments to count per student
  let enrollmentsMap: Record<string, number> = {};
  try {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("student_id")
      .eq("status", "active");

    if (enrollments) {
      enrollments.forEach((e) => {
        enrollmentsMap[e.student_id] = (enrollmentsMap[e.student_id] || 0) + 1;
      });
    }
  } catch {
    // Check purchases table fallback
    try {
      const { data: purchases } = await supabase
        .from("purchases")
        .select("student_id")
        .eq("payment_status", "completed");

      if (purchases) {
        purchases.forEach((p) => {
          enrollmentsMap[p.student_id] = (enrollmentsMap[p.student_id] || 0) + 1;
        });
      }
    } catch {
      // ignore
    }
  }

  return users.map((u) => ({
    id: u.user_id,
    user_id: u.user_id,
    email: u.email,
    full_name: u.full_name || u.email.split("@")[0],
    role: u.role,
    created_at: u.created_at,
    enrolled_count: enrollmentsMap[u.user_id] || 0,
  }));
}

/**
 * Fetch detailed student information, courses, purchases, and progress
 */
export async function getStudentDetails(studentId: string) {
  const supabase = createAdminClient();

  // 1. Fetch user role / profile
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", studentId)
    .maybeSingle();

  // 2. Fetch student's enrollments
  let enrolledCourses: any[] = [];
  try {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select("id, course_id, status, enrolled_at")
      .eq("student_id", studentId);

    if (enrollments && enrollments.length > 0) {
      const courseIds = enrollments.map((e) => e.course_id);
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title, class_level, price")
        .in("id", courseIds);

      enrolledCourses = enrollments.map((e) => {
        const course = courses?.find((c) => c.id === e.course_id);
        return {
          enrollmentId: e.id,
          courseId: e.course_id,
          status: e.status,
          enrolledAt: e.enrolled_at,
          courseTitle: course?.title || e.course_id,
          classLevel: course?.class_level || "Commerce",
        };
      });
    }
  } catch {
    // fallback
  }

  // 3. Fetch purchase history
  let purchases: any[] = [];
  try {
    const { data: purchaseData } = await supabase
      .from("purchases")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (purchaseData) {
      purchases = purchaseData;
    }
  } catch {
    // fallback
  }

  // 4. Fetch lecture progress
  let progressCount = 0;
  try {
    const { count } = await supabase
      .from("lecture_progress")
      .select("id", { count: "exact", head: true })
      .eq("student_id", studentId)
      .eq("completed", true);

    progressCount = count || 0;
  } catch {
    // fallback
  }

  return {
    student: userRole || { user_id: studentId, email: "Unknown", role: "student" },
    enrolledCourses,
    purchases,
    completedLecturesCount: progressCount,
  };
}

/**
 * Manually grant course access to student with audit logging
 */
export async function grantCourseAccess(params: {
  adminId: string;
  studentId: string;
  courseId: string;
  reason: string;
}) {
  const supabase = createAdminClient();

  // 1. Insert or update enrollment
  try {
    await supabase.from("enrollments").upsert(
      {
        student_id: params.studentId,
        course_id: params.courseId,
        status: "active",
        enrolled_at: new Date().toISOString(),
      },
      { onConflict: "student_id,course_id" }
    );
  } catch (err) {
    console.warn("Could not upsert into enrollments:", err);
  }

  // 2. Also insert completed purchase record for access inheritance
  try {
    await supabase.from("purchases").insert({
      student_id: params.studentId,
      course_id: params.courseId,
      amount: 0,
      payment_status: "completed",
      transaction_id: `MANUAL_GRANT_${Date.now()}`,
    });
  } catch (err) {
    console.warn("Could not insert purchase:", err);
  }

  // 3. Record in admin_audit_logs
  try {
    await supabase.from("admin_audit_logs").insert({
      admin_id: params.adminId,
      action: "GRANT_COURSE_ACCESS",
      entity_type: "course",
      entity_id: params.courseId,
      metadata: {
        student_id: params.studentId,
        reason: params.reason || "Manual enrollment granted by administrator",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn("Could not insert audit log:", err);
  }

  return { success: true, message: "Course access granted successfully" };
}

/**
 * Manually revoke course access from student with audit logging
 */
export async function revokeCourseAccess(params: {
  adminId: string;
  studentId: string;
  courseId: string;
  reason: string;
}) {
  const supabase = createAdminClient();

  // 1. Update enrollment status to revoked
  try {
    await supabase
      .from("enrollments")
      .update({ status: "revoked" })
      .eq("student_id", params.studentId)
      .eq("course_id", params.courseId);
  } catch (err) {
    console.warn("Could not update enrollments:", err);
  }

  // 2. Update purchases status to refunded/revoked
  try {
    await supabase
      .from("purchases")
      .update({ payment_status: "refunded" })
      .eq("student_id", params.studentId)
      .eq("course_id", params.courseId);
  } catch (err) {
    console.warn("Could not update purchases:", err);
  }

  // 3. Record in admin_audit_logs
  try {
    await supabase.from("admin_audit_logs").insert({
      admin_id: params.adminId,
      action: "REVOKE_COURSE_ACCESS",
      entity_type: "course",
      entity_id: params.courseId,
      metadata: {
        student_id: params.studentId,
        reason: params.reason || "Course access revoked by administrator",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.warn("Could not insert audit log:", err);
  }

  return { success: true, message: "Course access revoked successfully" };
}
