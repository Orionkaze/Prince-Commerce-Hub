import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import {
  sendPaymentSuccessEmail,
  sendAdminNewEnrollmentEmail,
} from "@/lib/email/service";


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
      itemTitle,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !courseId) {
      return NextResponse.json(
        { error: "Incomplete payment payload. Batch courseId is required." },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay cryptographic HMAC SHA-256 signature
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

    const supabase = createAdminClient();

    // 2. Validate course price from database (Never trust frontend amount)
    let verifiedAmount = 0;
    let verifiedTitle = itemTitle || "Accountancy Batch";

    const { data: course } = await supabase
      .from("courses")
      .select("title, price")
      .eq("id", courseId)
      .maybeSingle();

    if (course) {
      verifiedAmount = Number(course.price);
      verifiedTitle = course.title;
    } else if (courseId === "class-11") {
      verifiedAmount = 1;
      verifiedTitle = "Class 11 Accountancy (Crash Course)";
    } else if (courseId === "class-12") {
      verifiedAmount = 1;
      verifiedTitle = "Class 12 Accountancy (Crash Course)";
    }

    // 3. Update payment status in database
    await supabase
      .from("payments")
      .update({
        gateway_payment_id: razorpay_payment_id,
        razorpay_payment_id: razorpay_payment_id,
        payment_status: "success",
        status: "PAID",
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("gateway_order_id", razorpay_order_id);

    // 4. Create active enrollment record
    if (courseId) {
      try {
        await supabase.from("enrollments").upsert(
          {
            student_id: user.id,
            course_id: courseId,
            status: "active",
            enrolled_at: new Date().toISOString(),
          },
          { onConflict: "student_id,course_id" }
        );
      } catch (err) {
        console.warn("Enrollment upsert warning:", err);
      }
    }

    // 5. Insert verified purchase record
    const { data: purchase, error: purchaseErr } = await supabase
      .from("purchases")
      .insert({
        student_id: user.id,
        course_id: courseId,
        lecture_id: null,
        amount: verifiedAmount,
        payment_status: "completed",
        transaction_id: razorpay_payment_id,
      })
      .select()
      .single();

    if (purchaseErr) {
      console.error("Purchase record error:", purchaseErr);
    }

    // 6. Automated Transactional Emails via Resend (Non-blocking)
    const studentName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Student";
    const studentEmail = user.email || "";

    if (studentEmail) {
      try {
        await sendPaymentSuccessEmail({
          recipient: {
            email: studentEmail,
            name: studentName,
          },
          itemName: verifiedTitle,
          amount: verifiedAmount,
          transactionId: razorpay_payment_id,
          paymentDate: new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        });
      } catch (emailErr) {
        console.error("Student confirmation email error (non-fatal):", emailErr);
      }

      try {
        await sendAdminNewEnrollmentEmail({
          studentName,
          studentEmail,
          courseTitle: verifiedTitle,
          amount: verifiedAmount,
          transactionId: razorpay_payment_id,
        });
      } catch (adminEmailErr) {
        console.error("Admin notification email error (non-fatal):", adminEmailErr);
      }
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
      { error: error?.message || "Internal verification error" },
      { status: 500 }
    );
  }
}
