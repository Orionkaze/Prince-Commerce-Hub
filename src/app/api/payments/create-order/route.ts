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
    const { courseId, lectureId } = body;

    if (!courseId && !lectureId) {
      return NextResponse.json(
        { error: "Either courseId or lectureId must be provided." },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let price = 0;
    let itemTitle = "";

    if (courseId) {
      const { data: course, error } = await supabase
        .from("courses")
        .select("title, price")
        .eq("id", courseId)
        .single();

      if (error || !course) {
        // Fallback for default seed courses
        if (courseId === "class-11") {
          price = 12500;
          itemTitle = "Class 11 Accountancy";
        } else if (courseId === "class-12") {
          price = 14500;
          itemTitle = "Class 12 Accountancy";
        } else {
          return NextResponse.json({ error: "Course not found." }, { status: 404 });
        }
      } else {
        price = Number(course.price);
        itemTitle = course.title;
      }
    } else if (lectureId) {
      const { data: lecture, error } = await supabase
        .from("lectures")
        .select("title, price")
        .eq("id", lectureId)
        .single();

      if (error || !lecture) {
        return NextResponse.json({ error: "Lecture not found." }, { status: 404 });
      }

      price = Number(lecture.price);
      itemTitle = lecture.title;
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
        lectureId: lectureId || "",
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
