import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentSuccessEmail, sendPaymentFailedEmail } from "@/lib/email/service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      return NextResponse.json({ received: true });
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const amount = (paymentEntity.amount || 0) / 100;
    const email = paymentEntity.email;
    const notes = paymentEntity.notes || {};

    const supabase = await createClient();

    if (event === "payment.captured") {
      // 1. Update payment record
      await supabase
        .from("payments")
        .update({
          gateway_payment_id: paymentId,
          payment_status: "success",
        })
        .eq("gateway_order_id", orderId);

      // 2. Grant purchase access if not already recorded
      if (notes.userId) {
        await supabase.from("purchases").upsert(
          {
            student_id: notes.userId,
            course_id: notes.courseId || null,
            lecture_id: notes.lectureId || null,
            amount,
            payment_status: "completed",
            transaction_id: paymentId,
          },
          { onConflict: "id" }
        );

        if (email) {
          await sendPaymentSuccessEmail({
            recipient: { email, name: notes.userName || email },
            itemName: notes.itemTitle || "Course Enrollment",
            amount,
            transactionId: paymentId,
            paymentDate: new Date().toLocaleDateString("en-IN"),
          });
        }
      }
    } else if (event === "payment.failed") {
      await supabase
        .from("payments")
        .update({ payment_status: "failed" })
        .eq("gateway_order_id", orderId);

      if (email) {
        await sendPaymentFailedEmail({
          recipient: { email, name: notes.userName || email },
          itemName: notes.itemTitle || "Course Enrollment",
          amount,
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal webhook error" },
      { status: 500 }
    );
  }
}
