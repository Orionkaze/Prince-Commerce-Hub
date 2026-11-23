import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, verifyStudentAccess } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPresignedPlaybackUrl } from "@/lib/storage/r2";


export async function GET(
  req: NextRequest,
  context: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await context.params;
    const user = await getAuthenticatedUser();
    const supabase = createAdminClient();

    // Look in lecture_resources table first
    let resource: any = null;
    const { data: lecRes } = await supabase
      .from("lecture_resources")
      .select("*")
      .eq("id", resourceId)
      .maybeSingle();

    if (lecRes) {
      resource = {
        id: lecRes.id,
        title: lecRes.title,
        key: lecRes.object_key,
        lecture_id: lecRes.lecture_id,
        course_id: lecRes.course_id,
        isFree: false,
      };
    } else {
      // Check legacy resources table
      const { data: legacyRes } = await supabase
        .from("resources")
        .select("*")
        .eq("id", resourceId)
        .maybeSingle();

      if (legacyRes) {
        resource = {
          id: legacyRes.id,
          title: legacyRes.title,
          key: legacyRes.file_key,
          lecture_id: legacyRes.lecture_id,
          course_id: legacyRes.course_id,
          isFree: legacyRes.access_type === "free",
        };
      }
    }

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const hasAccess = await verifyStudentAccess({
      userId: user?.id,
      userEmail: user?.email,
      lectureId: resource.lecture_id,
      courseId: resource.course_id,
      isFree: resource.isFree,
    });

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Enrollment required to download this study material." },
        { status: 403 }
      );
    }

    const downloadUrl = await createPresignedPlaybackUrl({
      key: resource.key,
      expiresInSeconds: 3600,
      downloadFilename: `${resource.title.replace(/[^a-zA-Z0-9.-]/g, "_")}.pdf`,
    });

    return NextResponse.json({
      success: true,
      downloadUrl,
      title: resource.title,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to generate resource download" },
      { status: 500 }
    );
  }
}
