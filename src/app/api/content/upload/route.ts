import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";




export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Admin permissions
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const {
      title,
      teacherName = "Parvesh Kumar",
      subject = "Accountancy",
      courseId,
      newCourseTitle,
      chapterName,
      lectureNumber,
      description,
      contentType, // 'Recorded Lecture' | 'PDF Notes' | 'Study Material' | 'Assignment' | 'Other'
      accessType,  // 'free' | 'paid'
      price = 0,
      isPublished = true,
      videoKey,
      fileKey,
      thumbnailKey,
      duration = "45 mins",
    } = body;

    if (!title || !contentType) {
      return NextResponse.json(
        { error: "Title and Content Type are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 2. Handle Course creation if teacher specified a new course
    let targetCourseId = courseId || null;
    if (newCourseTitle && !courseId) {
      const generatedId = newCourseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { data: createdCourse, error: courseErr } = await supabase
        .from("courses")
        .upsert({
          id: generatedId,
          title: newCourseTitle,
          category: `${subject} Commerce`,
          description: description || `Course module for ${newCourseTitle}`,
          teacher_name: teacherName,
          subject,
          price: accessType === "paid" ? Number(price) : 0,
          thumbnail_key: thumbnailKey || "/images/accountancy-classroom.jpg",
          is_published: isPublished,
        })
        .select()
        .single();

      if (!courseErr && createdCourse) {
        targetCourseId = createdCourse.id;
      }
    }

    // 3. Route according to Content Type
    if (contentType === "Recorded Lecture") {
      const { data: lecture, error: lectureErr } = await supabase
        .from("lectures")
        .insert({
          course_id: targetCourseId,
          title,
          chapter: chapterName,
          lecture_number: lectureNumber || "1",
          description: description || "",
          teacher_name: teacherName,
          subject,
          video_key: videoKey,
          thumbnail_key: thumbnailKey || "/images/accountancy-classroom.jpg",
          duration,
          access_type: accessType === "free" ? "free" : "paid",
          price: accessType === "free" ? 0 : Number(price) || 0,
          is_published: Boolean(isPublished),
        })
        .select()
        .single();

      if (lectureErr) {
        console.error("Lecture insert error:", lectureErr);
        return NextResponse.json({ error: lectureErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Lecture uploaded and recorded successfully",
        data: lecture,
      });
    } else {
      // PDF Notes, Study Material, Assignment, Other
      let fileType: "pdf" | "notes" | "assignment" | "other" = "pdf";
      if (contentType === "Assignment") fileType = "assignment";
      else if (contentType === "Study Material") fileType = "notes";
      else if (contentType === "Other") fileType = "other";

      const { data: resource, error: resErr } = await supabase
        .from("resources")
        .insert({
          course_id: targetCourseId,
          title,
          description: description || "",
          file_key: fileKey || videoKey || "",
          file_type: fileType,
          file_format: fileType === "pdf" ? "PDF Document" : "Study Guide",
          category_label: `${subject} ${contentType}`,
          access_type: accessType === "free" ? "free" : "paid",
          is_published: Boolean(isPublished),
        })
        .select()
        .single();

      if (resErr) {
        console.error("Resource insert error:", resErr);
        return NextResponse.json({ error: resErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Resource uploaded and cataloged successfully",
        data: resource,
      });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process content upload" },
      { status: 500 }
    );
  }
}
