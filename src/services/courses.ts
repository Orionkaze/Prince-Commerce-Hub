import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { CourseRecord, CourseModuleRecord, LectureRecord, LectureResourceRecord } from "@/types/lms";

/**
 * Fetch all courses (Admin & Public)
 */
export async function getCourses(options?: {
  publishedOnly?: boolean;
  classLevel?: string;
  search?: string;
}) {
  const supabase = createAdminClient();
  let query = supabase.from("courses").select("*");

  if (options?.publishedOnly) {
    query = query.eq("is_published", true);
  }

  if (options?.classLevel) {
    query = query.eq("class_level", options.classLevel);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching courses:", error);
    return [];
  }

  // Count modules and lectures for each course
  const coursesWithCounts = await Promise.all(
    (data || []).map(async (course) => {
      try {
        const { count: modCount } = await supabase
          .from("course_modules")
          .select("id", { count: "exact", head: true })
          .eq("course_id", course.id);

        const { count: lecCount } = await supabase
          .from("lectures")
          .select("id", { count: "exact", head: true })
          .eq("course_id", course.id);

        return {
          ...course,
          modules_count: modCount || 0,
          lectures_count: lecCount || 0,
        };
      } catch {
        return course;
      }
    })
  );

  return coursesWithCounts as CourseRecord[];
}

/**
 * Fetch single course by ID or Slug with complete curriculum (Modules & Lectures)
 */
export async function getCourseWithCurriculum(courseIdOrSlug: string) {
  const supabase = createAdminClient();

  // 1. Fetch course details
  const { data, error: courseError } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseIdOrSlug)
    .maybeSingle();

  let course = data;
  if (courseError || !course) {
    if (courseIdOrSlug === "class-11") {
      course = {
        id: "class-11",
        title: "Class 11 Accountancy (Crash Course)",
        category: "Class 11 Commerce",
        badge: "CLASS 11 COMMERCE",
        description:
          "A comprehensive foundation in financial accounting, designed to help Class 11 Commerce students understand accounting concepts and develop strong numerical problem-solving skills. Covers accounting principles, accounting equations, journal entries, ledger posting, subsidiary books, cash book, bank reconciliation, depreciation, trial balance, rectification of errors and preparation of financial statements.",
        teacher_name: "Parvesh Kumar",
        subject: "Accountancy",
        thumbnail_key: "/images/class-11-accountancy.jpg",
        price: 1,
        original_price: 1200,
        is_published: true,
        mode: "Accountancy Crash Course",
        topics: [
          "Introduction and Theory Base of Accounting",
          "Accounting Equation, Journal and Ledger",
          "Cash Book and Subsidiary Books",
          "Bank Reconciliation Statement",
          "Depreciation, Provisions, Reserves and Trial Balance",
          "Financial Statements and Incomplete Records",
        ],
        highlights: [
          "Live + Recorded Batches",
          "Free PDFs",
          "Exam Oriented Preparations",
          "Self Evaluated Test",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else if (courseIdOrSlug === "class-12") {
      course = {
        id: "class-12",
        title: "Class 12 Accountancy (Crash Course)",
        category: "Class 12 Commerce",
        badge: "CLASS 12 COMMERCE",
        description:
          "An exam-focused Accountancy crash course for Class 12 Commerce students, covering partnership firms, company accounts and financial statement analysis. Develop strong numerical problem-solving skills through partnership adjustments, goodwill valuation, admission, retirement and dissolution of partners, share capital, debentures, accounting ratios and cash flow statements.",
        teacher_name: "Parvesh Kumar",
        subject: "Accountancy",
        thumbnail_key: "/images/class-12-accountancy.jpg",
        price: 1,
        original_price: 1300,
        is_published: true,
        mode: "Accountancy Crash Course",
        topics: [
          "Partnership Fundamentals and Goodwill",
          "Change in Profit Sharing Ratio and Admission of a Partner",
          "Retirement, Death and Dissolution of a Partnership Firm",
          "Accounting for Share Capital",
          "Issue and Accounting for Debentures",
          "Financial Statement Analysis, Accounting Ratios and Cash Flow Statement",
        ],
        highlights: [
          "Live + Recorded Batches",
          "Free PDFs",
          "Exam Oriented Preparations",
          "Self Evaluated Test",
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      return null;
    }
  }

  const courseId = course.id;

  // 2. Fetch modules ordered by position
  let modules: CourseModuleRecord[] = [];
  try {
    const { data: modData } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", courseId)
      .order("position", { ascending: true });

    if (modData && modData.length > 0) {
      modules = modData;
    }
  } catch (err) {
    console.warn("Could not fetch course_modules:", err);
  }

  // 3. Fetch lectures for this course
  let lectures: LectureRecord[] = [];
  try {
    const { data: lecData } = await supabase
      .from("lectures")
      .select("*")
      .eq("course_id", courseId)
      .order("created_at", { ascending: true });

    if (lecData) {
      lectures = lecData;
    }
  } catch (err) {
    console.warn("Could not fetch lectures:", err);
  }

  // If course_modules table is empty, only create module groups if lectures have distinct chapters
  if (modules.length === 0 && lectures.length > 0) {
    const lectureChapters = Array.from(
      new Set(lectures.map((l) => l.chapter).filter(Boolean))
    ) as string[];

    if (lectureChapters.length > 0) {
      modules = lectureChapters.map((title, idx) => ({
        id: `module-${idx + 1}-${title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24)}`,
        course_id: courseId,
        title,
        description: `Lectures in ${title}`,
        position: idx + 1,
        created_at: course.created_at || new Date().toISOString(),
      }));
    }
  }

  // 4. Fetch lecture resources
  let resources: LectureResourceRecord[] = [];
  try {
    const { data: resData } = await supabase
      .from("lecture_resources")
      .select("*")
      .eq("course_id", courseId);

    if (resData && resData.length > 0) {
      resources = resData;
    }
  } catch {
    // Check legacy resources table
  }

  if (resources.length === 0) {
    try {
      const { data: legacyRes } = await supabase
        .from("resources")
        .select("*")
        .eq("course_id", courseId);

      if (legacyRes) {
        resources = legacyRes.map((r) => ({
          id: r.id,
          lecture_id: r.lecture_id,
          course_id: r.course_id,
          title: r.title,
          object_key: r.file_key,
          file_type: r.file_type || "pdf",
          file_size: 0,
          created_at: r.created_at,
        }));
      }
    } catch {
      // ignore
    }
  }

  // Attach resources to lectures
  const lecturesWithResources = lectures.map((lec) => ({
    ...lec,
    resources: resources.filter((r) => r.lecture_id === lec.id),
  }));

  // Structure curriculum: nest lectures inside their respective modules/chapters
  const modulesWithLectures = modules.map((mod) => ({
    ...mod,
    lectures: lecturesWithResources.filter(
      (l) => l.chapter === mod.title || (l as any).module_id === mod.id
    ),
  }));

  // Also collect any unassigned lectures under an "Unassigned / General" virtual module if any exist
  const unassignedLectures = lecturesWithResources.filter(
    (l) =>
      !modules.some(
        (m) => m.title === l.chapter || m.id === (l as any).module_id
      )
  );

  if (unassignedLectures.length > 0) {
    modulesWithLectures.push({
      id: "general-module",
      course_id: courseId,
      title: "Core Lectures & Recordings",
      description: "Direct course recordings",
      position: modules.length + 1,
      created_at: new Date().toISOString(),
      lectures: unassignedLectures,
    });
  }

  // 5. Count active enrolled students for this course
  let enrolledStudentsCount = 0;
  try {
    const { count } = await supabase
      .from("enrollments")
      .select("id", { count: "exact", head: true })
      .eq("course_id", courseId)
      .eq("status", "active");
    enrolledStudentsCount = count || 0;
  } catch {
    // ignore
  }

  if (enrolledStudentsCount === 0) {
    try {
      const { count: purchaseCount } = await supabase
        .from("purchases")
        .select("id", { count: "exact", head: true })
        .eq("course_id", courseId)
        .eq("payment_status", "completed");
      enrolledStudentsCount = purchaseCount || 0;
    } catch {
      // ignore
    }
  }

  return {
    ...course,
    modules: modulesWithLectures,
    lectures_count: lectures.length,
    modules_count: modules.length,
    enrolled_students_count: enrolledStudentsCount,
  } as CourseRecord;
}

/**
 * Create a new course
 */
export async function createCourse(data: {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  badge?: string;
  description: string;
  instructor_name?: string;
  subject?: string;
  thumbnail_object_key?: string;
  price: number;
  original_price?: number;
  discounted_price?: number;
  class_level?: string;
  duration?: string;
  language?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}) {
  const supabase = createAdminClient();

  const id = data.id.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const slug = data.slug || id;

  const payload: any = {
    id,
    title: data.title,
    slug,
    category: data.category || `${data.class_level || "Class 12"} Commerce`,
    badge: data.badge || (data.class_level === "Class 11" ? "FOUNDATION MODULE" : "BOARD EXCELLENCE"),
    description: data.description,
    teacher_name: data.instructor_name || "Parvesh Kumar",
    instructor_name: data.instructor_name || "Parvesh Kumar",
    subject: data.subject || "Accountancy",
    thumbnail_key: data.thumbnail_object_key || null,
    thumbnail_object_key: data.thumbnail_object_key || null,
    price: data.price,
    original_price: data.original_price || data.price,
    discounted_price: data.discounted_price || data.price,
    class_level: data.class_level || "Class 12",
    duration: data.duration || "60+ Hours",
    language: data.language || "Hinglish",
    status: data.status || "DRAFT",
    is_published: data.status === "PUBLISHED",
    mode: "Online Batches & Interactive Sessions",
    updated_at: new Date().toISOString(),
  };

  const { data: created, error } = await supabase
    .from("courses")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create course: ${error.message}`);
  }

  return created;
}

/**
 * Update an existing course
 */
export async function updateCourse(courseId: string, updates: Partial<CourseRecord>) {
  const supabase = createAdminClient();

  const payload: any = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status) {
    payload.is_published = updates.status === "PUBLISHED";
  }

  if (updates.thumbnail_object_key) {
    payload.thumbnail_key = updates.thumbnail_object_key;
  }

  const { data, error } = await supabase
    .from("courses")
    .update(payload)
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update course: ${error.message}`);
  }

  return data;
}

/**
 * Archive or Delete a course safely
 */
export async function deleteCourse(courseId: string, force: boolean = false) {
  const supabase = createAdminClient();

  // Check if course has active purchases or enrollments
  const { count: purchaseCount } = await supabase
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("course_id", courseId);

  if (purchaseCount && purchaseCount > 0 && !force) {
    // Preserve historical data by archiving instead of hard delete
    return await updateCourse(courseId, { status: "ARCHIVED", is_published: false });
  }

  const { error } = await supabase.from("courses").delete().eq("id", courseId);
  if (error) {
    throw new Error(`Failed to delete course: ${error.message}`);
  }

  return { deleted: true };
}

/**
 * Module Management Functions
 */
export async function createCourseModule(data: {
  course_id: string;
  title: string;
  description?: string;
  position?: number;
}) {
  const supabase = createAdminClient();

  // 1. Try inserting into course_modules table if present
  try {
    let position = data.position;
    if (position === undefined) {
      const { count } = await supabase
        .from("course_modules")
        .select("id", { count: "exact", head: true })
        .eq("course_id", data.course_id);
      position = (count || 0) + 1;
    }

    const { data: moduleData, error } = await supabase
      .from("course_modules")
      .insert({
        course_id: data.course_id,
        title: data.title,
        description: data.description || "",
        position,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (!error && moduleData) {
      return moduleData;
    }
  } catch {
    // fallback to course topics
  }

  // 2. Append new chapter title to courses.topics array in Supabase
  try {
    const { data: course } = await supabase
      .from("courses")
      .select("topics")
      .eq("id", data.course_id)
      .single();

    const currentTopics = (course?.topics || []) as string[];
    if (!currentTopics.includes(data.title)) {
      const updatedTopics = [...currentTopics, data.title];
      await supabase
        .from("courses")
        .update({ topics: updatedTopics, updated_at: new Date().toISOString() })
        .eq("id", data.course_id);
    }
  } catch (err) {
    console.warn("Could not append to course.topics:", err);
  }

  return {
    id: `module-${Date.now()}-${data.title.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 24)}`,
    course_id: data.course_id,
    title: data.title,
    description: data.description || "",
    position: data.position || 1,
    created_at: new Date().toISOString(),
  };
}

export async function updateCourseModule(moduleId: string, updates: Partial<CourseModuleRecord>) {
  const supabase = createAdminClient();
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", moduleId)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch {
    // ignore
  }

  return {
    id: moduleId,
    title: updates.title || "Updated Module",
    ...updates,
  };
}

export async function deleteCourseModule(moduleId: string) {
  const supabase = createAdminClient();
  try {
    await supabase.from("course_modules").delete().eq("id", moduleId);
  } catch {
    // ignore
  }
  return { deleted: true };
}

export async function reorderModules(courseId: string, orderedModuleIds: string[]) {
  const supabase = createAdminClient();
  try {
    for (let i = 0; i < orderedModuleIds.length; i++) {
      await supabase
        .from("course_modules")
        .update({ position: i + 1, updated_at: new Date().toISOString() })
        .eq("id", orderedModuleIds[i]);
    }
  } catch {
    // ignore
  }
  return { reordered: true };
}

/**
 * Lecture Management Functions
 */
export async function createLecture(data: {
  course_id: string;
  module_id?: string;
  chapter?: string;
  title: string;
  description?: string;
  video_object_key?: string;
  video_key?: string;
  thumbnail_key?: string;
  thumbnail_object_key?: string;
  duration?: string;
  is_preview?: boolean;
  price?: number;
  position?: number;
  status?: "DRAFT" | "PUBLISHED";
  resource_key?: string;
  notes_key?: string;
}) {
  const supabase = createAdminClient();

  const isPreview = Boolean(data.is_preview);
  const videoKey = data.video_key || data.video_object_key || null;
  const thumbnailKey = data.thumbnail_key || data.thumbnail_object_key || null;

  // Resolve chapter title
  let chapterTitle = data.chapter || "";
  if (!chapterTitle && data.module_id) {
    try {
      const { data: mod } = await supabase
        .from("course_modules")
        .select("title")
        .eq("id", data.module_id)
        .maybeSingle();
      if (mod?.title) chapterTitle = mod.title;
    } catch {
      // ignore
    }
    if (!chapterTitle) {
      chapterTitle = data.module_id;
    }
  }

  // Live Supabase schema uses: course_id, title, chapter, description, teacher_name, subject, video_key, thumbnail_key, duration, access_type, price, is_published
  const payload: any = {
    course_id: data.course_id,
    title: data.title,
    chapter: chapterTitle || "General",
    description: data.description || "",
    video_key: videoKey,
    thumbnail_key: thumbnailKey,
    duration: data.duration || "45 mins",
    access_type: isPreview ? "free" : "paid",
    price: 0,
    is_published: data.status !== "DRAFT",
    teacher_name: "Parvesh Kumar",
    subject: "Accountancy",
    updated_at: new Date().toISOString(),
  };

  const { data: lecture, error } = await supabase
    .from("lectures")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lecture: ${error.message}`);
  }

  const resKey = data.resource_key || data.notes_key;
  if (resKey && lecture?.id) {
    try {
      await supabase.from("resources").insert({
        course_id: data.course_id,
        lecture_id: lecture.id,
        title: `${data.title} - Notes & Study Material`,
        file_key: resKey,
        file_type: "pdf",
        access_type: isPreview ? "free" : "paid",
        is_published: true,
      });
    } catch (rErr) {
      console.warn("Could not insert resource:", rErr);
    }
  }

  return lecture;
}

export async function updateLecture(
  lectureId: string,
  updates: Partial<LectureRecord> & { resource_key?: string; notes_key?: string }
) {
  const supabase = createAdminClient();

  const resourceKey = updates.resource_key || (updates as any).notes_key;

  // Clean updates to only fields that exist in the lectures table
  const payload: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.chapter !== undefined) payload.chapter = updates.chapter;
  if (updates.lecture_number !== undefined) payload.lecture_number = updates.lecture_number;
  if (updates.duration !== undefined) payload.duration = updates.duration;
  if (updates.video_key !== undefined) payload.video_key = updates.video_key;
  if (updates.video_object_key !== undefined) payload.video_key = updates.video_object_key;
  if (updates.thumbnail_key !== undefined) payload.thumbnail_key = updates.thumbnail_key;
  if ((updates as any).thumbnail_object_key !== undefined) payload.thumbnail_key = (updates as any).thumbnail_object_key;
  if (updates.is_preview !== undefined) {
    payload.access_type = updates.is_preview ? "free" : "paid";
  }
  if (updates.access_type !== undefined) {
    payload.access_type = updates.access_type;
  }
  if (updates.status !== undefined) {
    payload.is_published = updates.status === "PUBLISHED";
  }
  if (updates.is_published !== undefined) {
    payload.is_published = updates.is_published;
  }

  const { data, error } = await supabase
    .from("lectures")
    .update(payload)
    .eq("id", lectureId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lecture: ${error.message}`);
  }

  if (resourceKey && data?.course_id) {
    try {
      await supabase.from("resources").insert({
        course_id: data.course_id,
        lecture_id: lectureId,
        title: `${data.title} - Notes & Study Material`,
        file_key: resourceKey,
        file_type: "pdf",
        access_type: data.access_type || "paid",
        is_published: true,
      });
    } catch (rErr) {
      console.warn("Could not insert lecture resource on update:", rErr);
    }
  }

  return data;
}

export async function deleteLecture(lectureId: string) {
  const supabase = createAdminClient();
  try {
    await supabase.from("resources").delete().eq("lecture_id", lectureId);
  } catch (err) {
    console.warn("Could not delete associated resources:", err);
  }
  try {
    await supabase.from("lecture_progress").delete().eq("lecture_id", lectureId);
  } catch (err) {
    console.warn("Could not delete associated lecture_progress:", err);
  }
  const { error } = await supabase.from("lectures").delete().eq("id", lectureId);
  if (error) {
    throw new Error(`Failed to delete lecture: ${error.message}`);
  }
  return { deleted: true };
}

export async function reorderLectures(moduleId: string, orderedLectureIds: string[]) {
  const supabase = createAdminClient();
  for (let i = 0; i < orderedLectureIds.length; i++) {
    await supabase
      .from("lectures")
      .update({ position: i + 1, updated_at: new Date().toISOString() })
      .eq("id", orderedLectureIds[i]);
  }
  return { reordered: true };
}
