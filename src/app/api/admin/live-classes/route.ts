import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getAdminLiveClass,
  saveLiveClass,
  deleteLiveClass,
} from "@/services/live-classes";
import { isValidGoogleMeetUrl } from "@/lib/utils/live-class";

/**
 * GET: Fetch single Live Class config and course options for Admin
 */
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: auth.status });
  }

  try {
    const supabase = createAdminClient();

    // 1. Fetch current live class
    const liveClass = await getAdminLiveClass();

    // 2. Fetch all courses for dropdown
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, category, price, is_published")
      .order("created_at", { ascending: true });

    return NextResponse.json({
      liveClass,
      courses: courses || [],
    });
  } catch (error: any) {
    console.error("Admin live-classes GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load live class configuration" },
      { status: 500 }
    );
  }
}

/**
 * POST: Create or Update the single Live Class card
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: auth.status });
  }

  try {
    const body = await req.json();
    const {
      id,
      title,
      course_id,
      description,
      teacher_name,
      google_meet_url,
      scheduled_date,
      start_time,
      end_time,
      status,
      is_published,
    } = body;

    // Strict Validations
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Class title is required." }, { status: 400 });
    }

    if (!course_id) {
      return NextResponse.json(
        { error: "Please select an associated course for this live class." },
        { status: 400 }
      );
    }

    if (!google_meet_url || !isValidGoogleMeetUrl(google_meet_url)) {
      return NextResponse.json(
        { error: "Please provide a valid Google Meet link (e.g., https://meet.google.com/xxx-yyyy-zzz)." },
        { status: 400 }
      );
    }

    if (!scheduled_date) {
      return NextResponse.json({ error: "Scheduled date is required." }, { status: 400 });
    }

    if (!start_time || !end_time) {
      return NextResponse.json(
        { error: "Starting and ending times are required." },
        { status: 400 }
      );
    }

    const result = await saveLiveClass({
      id,
      title: title.trim(),
      course_id,
      description: description?.trim() || "",
      teacher_name: teacher_name?.trim() || "Parvesh Kumar",
      google_meet_url: google_meet_url.trim(),
      scheduled_date,
      start_time,
      end_time,
      status: status || "Upcoming",
      is_published: typeof is_published === "boolean" ? is_published : true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Live class saved successfully.",
      liveClass: result.data,
    });
  } catch (error: any) {
    console.error("Admin live-classes POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save live class." },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Delete Live Class
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Live class ID is required" }, { status: 400 });
    }

    const result = await deleteLiveClass(id);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Live class deleted successfully.",
    });
  } catch (error: any) {
    console.error("Admin live-classes DELETE error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete live class." },
      { status: 500 }
    );
  }
}
