import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, verifyStudentAccess, requireAdmin } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPresignedPlaybackUrl } from "@/lib/storage/r2";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ lectureId: string }> }
) {
  try {
    const { lectureId } = await context.params;
    const user = await getAuthenticatedUser();
    const supabase = createAdminClient();

    // 1. Fetch lecture record with real schema columns
    const { data: lecture, error } = await supabase
      .from("lectures")
      .select("id, title, course_id, video_key, access_type, duration")
      .eq("id", lectureId)
      .maybeSingle();

    if (error || !lecture) {
      console.error("Lecture query error:", error);
      return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
    }

    const isPreview = lecture.access_type === "free";

    // 2. Verify authorization
    let hasAccess = false;
    if (user) {
      hasAccess = await verifyStudentAccess({
        userId: user.id,
        userEmail: user.email,
        lectureId,
        courseId: lecture.course_id || undefined,
        isFree: isPreview,
      });
    } else {
      const adminAuth = await requireAdmin().catch(() => ({ authorized: false }));
      if (adminAuth.authorized) {
        hasAccess = true;
      } else if (isPreview) {
        hasAccess = true;
      }
    }

    // Administrators always have full access to stream and review lecture videos
    const referer = req.headers.get("referer") || "";
    const isFromAdminPage = referer.includes("/admin");
    const searchParams = req.nextUrl?.searchParams;
    const isAdminRequested = searchParams?.get("admin") === "true";

    if (!hasAccess && (isAdminRequested || isFromAdminPage)) {
      const adminAuth = await requireAdmin().catch(() => ({ authorized: false }));
      if (adminAuth.authorized) {
        hasAccess = true;
      }
    }

    // In local development, permit stream access for testing
    if (!hasAccess && process.env.NODE_ENV === "development") {
      hasAccess = true;
    }

    if (!hasAccess) {
      return NextResponse.json(
        {
          error: "Course enrollment required to access this lecture video.",
          requiresPurchase: true,
          courseId: lecture.course_id,
        },
        { status: 403 }
      );
    }

    const videoKey = lecture.video_key;

    if (!videoKey) {
      // If no video key uploaded yet, return empty stream info
      return NextResponse.json({
        hasVideo: false,
        message: "No video file has been attached to this lecture yet.",
        title: lecture.title,
        duration: lecture.duration,
        isPreview,
      });
    }

    // 3. Generate short-lived signed playback URL (valid for 2 hours)
    const playbackUrl = await createPresignedPlaybackUrl({
      key: videoKey,
      expiresInSeconds: 7200,
    });

    return NextResponse.json({
      success: true,
      hasVideo: true,
      playbackUrl,
      title: lecture.title,
      duration: lecture.duration,
      isPreview,
    });
  } catch (error: any) {
    console.error("Lecture stream error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate video stream" },
      { status: 500 }
    );
  }
}
