import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";


export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    const supabase = createAdminClient();

    // 1. Fetch from purchases table (verified student transactions)
    let query = supabase
      .from("purchases")
      .select("*")
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("payment_status", status);
    }

    const { data: purchases, error } = await query;
    if (error) {
      console.error("Purchases query error:", error);
    }

    // 2. Fetch all user emails to enrich orders
    const { data: users } = await supabase.from("user_roles").select("user_id, email, full_name");
    const userMap = new Map((users || []).map((u) => [u.user_id, u]));

    // 3. Fetch courses to enrich course titles
    const { data: courses } = await supabase.from("courses").select("id, title, price");
    const courseMap = new Map((courses || []).map((c) => [c.id, c]));

    const enrichedOrders = (purchases || []).map((p) => {
      const user = userMap.get(p.student_id);
      const course = p.course_id ? courseMap.get(p.course_id) : null;

      return {
        id: p.id,
        student_id: p.student_id,
        student_name: user?.full_name || user?.email?.split("@")[0] || "Student",
        student_email: user?.email || "student@primecommerce.com",
        item_title: course?.title || (p.course_id ? `Course (${p.course_id})` : "Lecture Access"),
        amount: Number(p.amount) || 0,
        currency: "INR",
        payment_status: p.payment_status || "completed",
        transaction_id: p.transaction_id || "TXN_PENDING",
        created_at: p.created_at,
      };
    });

    const filtered = enrichedOrders.filter((o) => {
      if (!search) return true;
      const lower = search.toLowerCase();
      return (
        o.student_name.toLowerCase().includes(lower) ||
        o.student_email.toLowerCase().includes(lower) ||
        o.transaction_id.toLowerCase().includes(lower) ||
        o.item_title.toLowerCase().includes(lower)
      );
    });

    return NextResponse.json({
      orders: filtered,
      totalCount: filtered.length,
      totalRevenue: filtered
        .filter((o) => o.payment_status === "completed")
        .reduce((sum, o) => sum + o.amount, 0),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
