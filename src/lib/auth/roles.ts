import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRole } from "@/types/lms";

// Dynamically resolve designated administrator emails from environment variables
export function getAdminEmails(): string[] {
  const envList = [
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_EMAILS,
    process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    process.env.NEXT_PUBLIC_ADMIN_EMAILS,
  ]
    .filter(Boolean)
    .join(",")
    .toLowerCase()
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  return Array.from(new Set(envList));
}

export const ADMIN_EMAILS = getAdminEmails();

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
  const adminEmails = getAdminEmails();
  if (email && adminEmails.length > 0 && adminEmails.includes(email.toLowerCase())) {
    return "admin";
  }

  // Use service role admin client to query user_roles dynamically from Supabase
  const supabase = createAdminClient();

  // 1. Check user_roles table by user_id
  try {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (roleData?.role === "admin") {
      return "admin";
    }
  } catch {
    // ignore
  }

  // 2. Also check user_roles table by email if user_id wasn't matched
  if (email) {
    try {
      const { data: roleByEmail } = await supabase
        .from("user_roles")
        .select("role")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (roleByEmail?.role === "admin") {
        return "admin";
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback check: lookup email via auth.admin if email was not supplied
  if (!email && adminEmails.length > 0) {
    try {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      if (authUser?.user?.email && adminEmails.includes(authUser.user.email.toLowerCase())) {
        return "admin";
      }
    } catch {
      // ignore
    }
  }

  return "student";
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

  const supabase = createAdminClient();

  // 1. Check Course Access
  if (params.courseId) {
    // A. Check enrollments table first
    try {
      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id, status")
        .eq("student_id", params.userId)
        .eq("course_id", params.courseId)
        .order("enrolled_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (enrollment) {
        // If explicitly revoked or inactive, immediately deny access
        if (enrollment.status === "revoked" || enrollment.status === "cancelled" || enrollment.status === "expired") {
          return false;
        }
        if (enrollment.status === "active") {
          return true;
        }
      }
    } catch {
      // Table might not exist yet
    }

    // B. Check purchases table only if no explicit enrollment status
    try {
      const { data: coursePurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("student_id", params.userId)
        .eq("course_id", params.courseId)
        .eq("payment_status", "completed")
        .limit(1)
        .maybeSingle();

      if (coursePurchase) return true;
    } catch {
      // Table might not exist yet
    }
  }

  // 2. Check Lecture Access
  if (params.lectureId) {
    // Check if lecture is preview / free
    const { data: lecture } = await supabase
      .from("lectures")
      .select("id, course_id, access_type")
      .eq("id", params.lectureId)
      .maybeSingle();

    if (lecture?.access_type === "free") {
      return true;
    }

    // Check individual lecture purchase
    try {
      const { data: lecturePurchase } = await supabase
        .from("purchases")
        .select("id")
        .eq("student_id", params.userId)
        .eq("lecture_id", params.lectureId)
        .eq("payment_status", "completed")
        .limit(1)
        .maybeSingle();

      if (lecturePurchase) return true;
    } catch {
      // ignore
    }

    // Access Inheritance: Check if parent course is unlocked for student
    if (lecture?.course_id) {
      return verifyStudentAccess({
        userId: params.userId,
        userEmail: params.userEmail,
        courseId: lecture.course_id,
      });
    }
  }

  return false;
}
