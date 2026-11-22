import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { deleteR2Object } from "@/lib/storage/r2";


// GET: Fetch all content items for teacher management drawer
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabase = await createClient();

    const [coursesRes, lecturesRes, resourcesRes] = await Promise.all([
      supabase.from("courses").select("*").order("created_at", { ascending: false }),
      supabase.from("lectures").select("*").order("created_at", { ascending: false }),
      supabase.from("resources").select("*").order("created_at", { ascending: false }),
    ]);

    return NextResponse.json({
      success: true,
      courses: coursesRes.data || [],
      lectures: lecturesRes.data || [],
      resources: resourcesRes.data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// PATCH: Update content price, publication status, or title
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await req.json();
    const { itemType, id, price, isPublished, title, description } = body;

    if (!itemType || !id) {
      return NextResponse.json(
        { error: "itemType (course | lecture | resource) and id are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
    if (price !== undefined) updateData.price = Number(price);
    if (isPublished !== undefined) updateData.is_published = Boolean(isPublished);
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    let tableName = "courses";
    if (itemType === "lecture") tableName = "lectures";
    else if (itemType === "resource") tableName = "resources";

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update item" },
      { status: 500 }
    );
  }
}

// DELETE: Delete lecture, course, or resource
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(req.url);
    const itemType = searchParams.get("itemType");
    const id = searchParams.get("id");

    if (!itemType || !id) {
      return NextResponse.json(
        { error: "itemType and id query parameters required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let tableName = "courses";
    if (itemType === "lecture") tableName = "lectures";
    else if (itemType === "resource") tableName = "resources";

    // 1. Get object key if any
    const { data: item } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (item) {
      if (item.video_key) await deleteR2Object(item.video_key);
      if (item.file_key) await deleteR2Object(item.file_key);
      if (item.thumbnail_key && !item.thumbnail_key.startsWith("/")) {
        await deleteR2Object(item.thumbnail_key);
      }
    }

    // 2. Delete row from Supabase
    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete item" },
      { status: 500 }
    );
  }
}
