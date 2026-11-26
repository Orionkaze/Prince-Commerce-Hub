import { createAdminClient } from "@/lib/supabase/admin";
import { LiveClassRecord } from "@/types/lms";

/**
 * Fetch the single active published live class for students.
 */
export async function getActiveLiveClass(): Promise<LiveClassRecord | null> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from("live_classes")
      .select(`
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
        created_at,
        updated_at
      `)
      .eq("is_published", true)
      .order("scheduled_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error && error.code !== "PGRST116") {
        console.warn("Could not query live_classes from Supabase:", error.message);
      }
      return null;
    }

    // Fetch associated course info
    let courseInfo = undefined;
    if (data.course_id) {
      const { data: cData } = await supabase
        .from("courses")
        .select("id, title, price, slug")
        .eq("id", data.course_id)
        .maybeSingle();

      if (cData) {
        courseInfo = {
          id: cData.id,
          title: cData.title,
          price: Number(cData.price || 99),
          slug: cData.slug || cData.id,
        };
      }
    }

    return {
      ...data,
      course: courseInfo,
    } as LiveClassRecord;
  } catch (err) {
    console.warn("Failed to fetch active live class:", err);
    return null;
  }
}

/**
 * Fetch the current live class for Admin Dashboard (includes unpublished and Google Meet URL).
 */
export async function getAdminLiveClass(): Promise<LiveClassRecord | null> {
  const supabase = createAdminClient();

  try {
    const { data, error } = await supabase
      .from("live_classes")
      .select(`
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
        created_at,
        updated_at
      `)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    let courseInfo = undefined;
    if (data.course_id) {
      const { data: cData } = await supabase
        .from("courses")
        .select("id, title, price, slug")
        .eq("id", data.course_id)
        .maybeSingle();

      if (cData) {
        courseInfo = {
          id: cData.id,
          title: cData.title,
          price: Number(cData.price || 99),
          slug: cData.slug || cData.id,
        };
      }
    }

    return {
      ...data,
      course: courseInfo,
    } as LiveClassRecord;
  } catch (err) {
    console.warn("Failed to fetch admin live class:", err);
    return null;
  }
}

/**
 * Save or update the single live class record.
 */
export async function saveLiveClass(
  classData: Partial<LiveClassRecord> & {
    title: string;
    course_id: string;
    google_meet_url: string;
    scheduled_date: string;
    start_time: string;
    end_time: string;
  }
): Promise<{ success: boolean; data?: LiveClassRecord; error?: string }> {
  const supabase = createAdminClient();

  try {
    const payload = {
      title: classData.title,
      course_id: classData.course_id,
      description: classData.description || "",
      teacher_name: classData.teacher_name || "Parvesh Kumar",
      google_meet_url: classData.google_meet_url,
      scheduled_date: classData.scheduled_date,
      start_time: classData.start_time,
      end_time: classData.end_time,
      status: classData.status || "Upcoming",
      is_published: typeof classData.is_published === "boolean" ? classData.is_published : true,
      updated_at: new Date().toISOString(),
    };

    let result;

    if (classData.id) {
      // Update existing
      result = await supabase
        .from("live_classes")
        .update(payload)
        .eq("id", classData.id)
        .select()
        .single();
    } else {
      // Check if any record exists; since there is only ONE live class card, update if exists or insert
      const { data: existing } = await supabase
        .from("live_classes")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (existing) {
        result = await supabase
          .from("live_classes")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from("live_classes")
          .insert({
            ...payload,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
      }
    }

    if (result.error) {
      return { success: false, error: result.error.message };
    }

    return { success: true, data: result.data as LiveClassRecord };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to save live class." };
  }
}

/**
 * Delete live class.
 */
export async function deleteLiveClass(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient();

  try {
    const { error } = await supabase.from("live_classes").delete().eq("id", id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete live class." };
  }
}
