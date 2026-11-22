import { createClient } from "@/lib/supabase/server";
import { UserRole } from "@/types/lms";

// Designated administrator emails
export const ADMIN_EMAILS = [
  "parveshdhiman1900@gmail.com",
  (process.env.ADMIN_EMAIL || "").toLowerCase(),
].filter(Boolean);

/**
 * Server-side helper to fetch authenticated user from session cookies
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }
  return user;
}

/**
 * Server-side check for user's role ('admin' | 'student')
 */
export async function getUserRole(userId: string, email?: string): Promise<UserRole> {
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
    return "admin";
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // If not found in DB but matches designated admin
    if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
      return "admin";
    }
    return "student";
  }

  return (data.role as UserRole) || "student";
}

/**
 * Enforce that the requesting user is an authenticated Admin
 * Throws or returns an unauthorized response if not.
 */
export async function requireAdmin() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return { authorized: false, status: 401, error: "Authentication required", user: null };
  }

  const role = await getUserRole(user.id, user.email);
  if (role !== "admin") {
    return {
      authorized: false,
      status: 403,
      error: "Forbidden: Administrator permissions required",
      user,
    };
  }

  return { authorized: true, status: 200, user };
}

/**
 * Check if a student has valid access to a lecture or complete course
 */
export async function verifyStudentAccess(params: {
  userId?: string | null;
  userEmail?: string | null;
  lectureId?: string;
  courseId?: string;
  isFree?: boolean;
}): Promise<boolean> {
  // Free content is accessible to everyone
  if (params.isFree) return true;

  // If no user is logged in, paid content is locked
  if (!params.userId) return false;

  // Admin always has full access
  const role = await getUserRole(params.userId, params.userEmail || undefined);
  if (role === "admin") return true;

  const supabase = await createClient();

  // 1. Direct course purchase check
  if (params.courseId) {
    const { data: coursePurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("student_id", params.userId)
      .eq("course_id", params.courseId)
      .eq("payment_status", "completed")
      .limit(1)
      .maybeSingle();

    if (coursePurchase) return true;
  }

  // 2. Direct lecture purchase check
  if (params.lectureId) {
    const { data: lecturePurchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("student_id", params.userId)
      .eq("lecture_id", params.lectureId)
      .eq("payment_status", "completed")
      .limit(1)
      .maybeSingle();

    if (lecturePurchase) return true;

    // 3. Access Inheritance: Check if parent course was purchased
    const { data: lecture } = await supabase
      .from("lectures")
      .select("course_id")
      .eq("id", params.lectureId)
      .maybeSingle();

    if (lecture?.course_id) {
      const { data: parentCoursePurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("student_id", params.userId)
        .eq("course_id", lecture.course_id)
        .eq("payment_status", "completed")
        .limit(1)
        .maybeSingle();

      if (parentCoursePurchase) return true;
    }
  }

  return false;
}
