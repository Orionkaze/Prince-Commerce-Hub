import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/payments/razorpay";




export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to initiate enrollment." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "A valid course batch ID (e.g. class-11 or class-12) is required. Individual lecture purchases are not permitted." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let price = 0;
    let itemTitle = "";

    const { data: course, error } = await supabase
      .from("courses")
      .select("title, price")
      .eq("id", courseId)
      .maybeSingle();

    if (error || !course) {
      // Fallback for default canonical batches
      if (courseId === "class-11") {
        price = 99;
        itemTitle = "Class 11 Accountancy (Crash Course)";
      } else if (courseId === "class-12") {
        price = 99;
        itemTitle = "Class 12 Accountancy (Crash Course)";
      } else {
        return NextResponse.json({ error: "Batch not found." }, { status: 404 });
      }
    } else {
      price = Number(course.price);
      itemTitle = course.title;
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "This content is free or has invalid pricing." },
        { status: 400 }
      );
    }

    // Create Razorpay Order
    const receiptId = `rcpt_${Date.now()}`;
    const order = await createRazorpayOrder({
      amountInINR: price,
      receiptId,
      notes: {
        userId: user.id,
        userEmail: user.email || "",
        courseId: courseId || "",
        lectureId: "",
        itemTitle,
      },
    });

    // Record pending payment in Supabase
    await supabase.from("payments").insert({
      student_id: user.id,
      gateway_order_id: order.orderId,
      amount: price,
      currency: "INR",
      payment_status: "pending",
    });

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      keyId: order.keyId,
      isMock: order.isMock,
      itemTitle,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email,
      },
    });
  } catch (error: any) {
    console.error("Payment Order Creation Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate payment order." },
      { status: 500 }
    );
  }
}
