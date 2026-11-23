import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendPaymentSuccessEmail,
  sendAdminNewEnrollmentEmail,
  sendPaymentFailedEmail,
} from "@/lib/email/service";


export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    // 1. Verify Webhook Signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const eventId = payload.event_id || `${event}_${paymentEntity?.id || Date.now()}`;

    const supabase = createAdminClient();

    // 2. Idempotency Check via webhook_events table
    try {
      const { data: existingEvent } = await supabase
        .from("webhook_events")
        .select("id")
        .eq("provider", "razorpay")
        .eq("event_id", eventId)
        .maybeSingle();

      if (existingEvent) {
        console.log(`[Webhook] Duplicate event suppressed: ${eventId}`);
        return NextResponse.json({ received: true, alreadyProcessed: true });
      }
    } catch {
      // ignore
    }

    if (!paymentEntity) {
      return NextResponse.json({ received: true });
    }

    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const amount = (paymentEntity.amount || 0) / 100;
    const email = paymentEntity.email;
    const notes = paymentEntity.notes || {};

    if (event === "payment.captured") {
      // 3. Update payment record
      await supabase
        .from("payments")
        .update({
          gateway_payment_id: paymentId,
          razorpay_payment_id: paymentId,
          payment_status: "success",
          status: "PAID",
          verified_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("gateway_order_id", orderId);

      // 4. Grant access: enrollments & purchases
      if (notes.userId) {
        if (notes.courseId) {
          try {
            await supabase.from("enrollments").upsert(
              {
                student_id: notes.userId,
                course_id: notes.courseId,
                status: "active",
                enrolled_at: new Date().toISOString(),
              },
              { onConflict: "student_id,course_id" }
            );
          } catch {
            // ignore
          }
        }

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

        // 5. Send automated confirmation emails (Deduplication handled in sendEmail)
        if (email) {
          try {
            await sendPaymentSuccessEmail({
              recipient: { email, name: notes.userName || notes.userEmail || email },
              itemName: notes.itemTitle || "Course Enrollment",
              amount,
              transactionId: paymentId,
              paymentDate: new Date().toLocaleDateString("en-IN"),
            });
          } catch (e) {
            console.error("Student email send warning:", e);
          }

          try {
            await sendAdminNewEnrollmentEmail({
              studentName: notes.userName || email,
              studentEmail: email,
              courseTitle: notes.itemTitle || "Accountancy Course",
              amount,
              transactionId: paymentId,
            });
          } catch (e) {
            console.error("Admin email send warning:", e);
          }
        }
      }
    } else if (event === "payment.failed") {
      await supabase
        .from("payments")
        .update({
          payment_status: "failed",
          status: "FAILED",
          updated_at: new Date().toISOString(),
        })
        .eq("gateway_order_id", orderId);

      if (email) {
        try {
          await sendPaymentFailedEmail({
            recipient: { email, name: notes.userName || email },
            itemName: notes.itemTitle || "Course Enrollment",
            amount,
          });
        } catch {
          // ignore
        }
      }
    }

    // 6. Record processed webhook event for idempotency
    try {
      await supabase.from("webhook_events").insert({
        provider: "razorpay",
        event_id: eventId,
        event_type: event,
        payload,
        processed_at: new Date().toISOString(),
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ status: "ok", received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal webhook error" },
      { status: 500 }
    );
  }
}
