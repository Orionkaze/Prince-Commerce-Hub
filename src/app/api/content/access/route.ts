import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, verifyStudentAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createPresignedPlaybackUrl } from "@/lib/storage/r2";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "lecture" | "resource"
    const id = searchParams.get("id");

    if (!type || !id) {
      return NextResponse.json(
        { error: "Type and ID are required" },
        { status: 400 }
      );
    }

    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    let isFree = false;
    let fileKey = "";
    let filename = "content";

    if (type === "lecture") {
      const { data: lecture, error } = await supabase
        .from("lectures")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !lecture) {
        return NextResponse.json({ error: "Lecture not found" }, { status: 404 });
      }

      isFree = lecture.access_type === "free";
      fileKey = lecture.video_key || "";
      filename = `${lecture.title}.mp4`;

      const hasAccess = await verifyStudentAccess({
        userId: user?.id,
        userEmail: user?.email,
        lectureId: lecture.id,
        courseId: lecture.course_id || undefined,
        isFree,
      });

      if (!hasAccess) {
        return NextResponse.json(
          {
            allowed: false,
            message: "Content is locked. Please purchase this lecture or complete course.",
          },
          { status: 403 }
        );
      }
    } else {
      // Resource (PDF / Notes / Assignment)
      const { data: resource, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !resource) {
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      }

      isFree = resource.access_type === "free";
      fileKey = resource.file_key || "";
      filename = `${resource.title}.pdf`;

      const hasAccess = await verifyStudentAccess({
        userId: user?.id,
        userEmail: user?.email,
        lectureId: resource.lecture_id || undefined,
        courseId: resource.course_id || undefined,
        isFree,
      });

      if (!hasAccess) {
        return NextResponse.json(
          {
            allowed: false,
            message: "Resource is locked. Please enroll in the course to access.",
          },
          { status: 403 }
        );
      }
    }

    // Generate secure presigned playback or download URL
    const streamUrl = await createPresignedPlaybackUrl({
      key: fileKey,
      expiresInSeconds: 3600, // 1 hour token
    });

    const downloadUrl = await createPresignedPlaybackUrl({
      key: fileKey,
      expiresInSeconds: 3600,
      downloadFilename: filename,
    });

    return NextResponse.json({
      allowed: true,
      streamUrl,
      downloadUrl,
      fileKey,
      filename,
    });
  } catch (error: any) {
    console.error("Access verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate content access link" },
      { status: 500 }
    );
  }
}
