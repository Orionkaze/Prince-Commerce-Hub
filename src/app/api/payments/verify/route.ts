import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { sendPaymentSuccessEmail } from "@/lib/email/service";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      lectureId,
      amount,
      itemTitle,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json(
        { error: "Incomplete payment payload." },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay cryptographic signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature || "mock-signature",
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature. Transaction verification failed." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 2. Update payment status in database
    await supabase
      .from("payments")
      .update({
        gateway_payment_id: razorpay_payment_id,
        payment_status: "success",
      })
      .eq("gateway_order_id", razorpay_order_id);

    // 3. Grant access: Insert purchase record
    const { data: purchase, error: purchaseErr } = await supabase
      .from("purchases")
      .insert({
        student_id: user.id,
        course_id: courseId || null,
        lecture_id: lectureId || null,
        amount: Number(amount) || 0,
        payment_status: "completed",
        transaction_id: razorpay_payment_id,
      })
      .select()
      .single();

    if (purchaseErr) {
      console.error("Purchase record error:", purchaseErr);
    }

    // 4. Send Confirmation Email via Resend
    if (user.email) {
      await sendPaymentSuccessEmail({
        recipient: {
          email: user.email,
          name: user.user_metadata?.full_name || user.email,
        },
        itemName: itemTitle || "Course Enrollment",
        amount: Number(amount) || 0,
        transactionId: razorpay_payment_id,
        paymentDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified and course access granted!",
      purchaseId: purchase?.id,
      transactionId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
