import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getUserRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveLiveClass } from "@/services/live-classes";
import { computeLiveClassStatus } from "@/lib/utils/live-class";
import { StudentLiveClassAccessResponse } from "@/types/lms";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const liveClass = await getActiveLiveClass();

    if (!liveClass) {
      const response: StudentLiveClassAccessResponse = {
        liveClass: null,
        isAuthenticated: Boolean(user),
        isEnrolled: false,
        hasAccess: false,
        userEmail: user?.email || null,
      };
      return NextResponse.json(response);
    }

    const computedStatus = computeLiveClassStatus(
      liveClass.status,
      liveClass.scheduled_date,
      liveClass.start_time,
      liveClass.end_time
    );

    // If user is not authenticated: strictly lock access and NEVER reveal meet URL
    if (!user) {
      const sanitizedClass = {
        ...liveClass,
        computed_status: computedStatus,
        google_meet_url: null, // Private link hidden
      };

      const response: StudentLiveClassAccessResponse = {
        liveClass: sanitizedClass,
        isAuthenticated: false,
        isEnrolled: false,
        hasAccess: false,
        userEmail: null,
      };
      return NextResponse.json(response);
    }

    const supabase = createAdminClient();
    let hasAccess = false;

    // 1. Check if user is an Administrator (Admins always have full access)
    const role = await getUserRole(user.id, user.email);
    if (role === "admin") {
      hasAccess = true;
    } else if (liveClass.course_id) {
      // 2. Check enrollments table (active enrollment)
      try {
        const { data: enrollment } = await supabase
          .from("enrollments")
          .select("id, status")
          .eq("student_id", user.id)
          .eq("course_id", liveClass.course_id)
          .eq("status", "active")
          .maybeSingle();

        if (enrollment) {
          hasAccess = true;
        }
      } catch {
        // ignore
      }

      // 3. Check verified purchases table (completed payment)
      if (!hasAccess) {
        try {
          const { data: purchase } = await supabase
            .from("purchases")
            .select("id, payment_status")
            .eq("student_id", user.id)
            .eq("course_id", liveClass.course_id)
            .eq("payment_status", "completed")
            .maybeSingle();

          if (purchase) {
            hasAccess = true;
          }
        } catch {
          // ignore
        }
      }
    }

    // Prepare response: only expose the google_meet_url if hasAccess is true!
    const resultClass = {
      ...liveClass,
      computed_status: computedStatus,
      google_meet_url: hasAccess ? liveClass.google_meet_url : null,
    };

    const response: StudentLiveClassAccessResponse = {
      liveClass: resultClass,
      isAuthenticated: true,
      isEnrolled: hasAccess,
      hasAccess: hasAccess,
      userEmail: user.email || null,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_") || error?.digest === "HANGING_PROMISE_REJECTION") {
      throw error;
    }
    console.error("Error in active live class endpoint:", error);
    return NextResponse.json(
      { error: "Failed to retrieve live class status." },
      { status: 500 }
    );
  }
}
