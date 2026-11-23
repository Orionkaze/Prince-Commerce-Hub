import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  process.env.EMAIL_FROM ||
  "Prime Commerce Hub <admissions@primecommerceclasses.com>";

export const isResendConfigured = Boolean(RESEND_API_KEY);
export const resend = isResendConfigured ? new Resend(RESEND_API_KEY) : null;

export interface EmailRecipient {
  email: string;
  name: string;
}

/**
 * Base email wrapper with consistent Prime Commerce Hub branding
 */
function wrapEmailTemplate(contentHtml: string, previewText: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${previewText}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f9; margin: 0; padding: 24px; color: #16141b; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #16141b; padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
    .badge { display: inline-block; background: #fde047; color: #16141b; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; text-transform: uppercase; }
    .body { padding: 32px; font-size: 15px; line-height: 1.6; color: #374151; }
    .info-card { background: #f7f7f9; border-radius: 14px; padding: 18px; margin: 20px 0; border: 1px solid #e5e7eb; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
    .info-label { color: #6b7280; font-weight: 500; }
    .info-value { color: #16141b; font-weight: 700; }
    .btn { display: inline-block; background: #5b32d6; color: #ffffff !important; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 9999px; text-decoration: none; margin-top: 16px; }
    .footer { background: #f9fafb; padding: 24px 32px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Prime Commerce Hub</span>
      <h1>PRIME COMMERCE HUB</h1>
    </div>
    <div class="body">
      ${contentHtml}
    </div>
    <div class="footer">
      <p><strong>Prime Commerce Hub</strong> — Expert Accountancy Coaching for Class 11th &amp; 12th Commerce</p>
      <p>Founder &amp; Lead Educator: Parvesh Kumar (30+ Years Exp)</p>
      <p>Questions? Contact us at <a href="mailto:parveshdhiman1900@gmail.com" style="color: #5b32d6;">parveshdhiman1900@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Robust Email Dispatcher with Deduplication & Logging in Supabase
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  options?: {
    templateType?: string;
    relatedEntityId?: string;
  }
) {
  const supabase = createAdminClient();

  // Deduplication check: if this template was already successfully sent for this entity, skip!
  if (options?.templateType && options?.relatedEntityId) {
    try {
      const { data: existing } = await supabase
        .from("email_logs")
        .select("id")
        .eq("recipient", to)
        .eq("template_type", options.templateType)
        .eq("related_entity_id", options.relatedEntityId)
        .eq("status", "sent")
        .maybeSingle();

      if (existing) {
        console.log(`[Email Service] Duplicate suppressed: ${options.templateType} to ${to}`);
        return { success: true, skipped: true };
      }
    } catch {
      // ignore
    }
  }

  if (!resend) {
    console.log(`[Resend Mock Send] To: ${to} | Subject: ${subject}`);
    return { success: true, isMock: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    // Record in email_logs
    try {
      await supabase.from("email_logs").insert({
        recipient: to,
        template_type: options?.templateType || "general",
        related_entity_id: options?.relatedEntityId || null,
        provider_message_id: (data as any)?.data?.id || null,
        status: "sent",
        sent_at: new Date().toISOString(),
      });
    } catch {
      // ignore
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("[Resend Error]:", error);

    // Record failure in email_logs
    try {
      await supabase.from("email_logs").insert({
        recipient: to,
        template_type: options?.templateType || "general",
        related_entity_id: options?.relatedEntityId || null,
        status: "failed",
        error_message: error?.message || "Send failed",
      });
    } catch {
      // ignore
    }

    return { success: false, error: error?.message };
  }
}

/**
 * 1. Welcome Email
 */
export async function sendWelcomeEmail(recipient: EmailRecipient) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 22px; font-weight: 800; margin-top: 0;">Welcome to Prime Commerce Hub!</h2>
    <p>Hello <strong>${recipient.name}</strong>,</p>
    <p>Your student account has been created. You now have access to explore free accountancy study materials, sample formula sheets, and preview batch recordings led by Parvesh Sir.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses" class="btn">Explore Courses &amp; Batches</a>
    </div>
    <p style="font-size: 13px; color: #6b7280;">If you ever need personalized course counseling or batch advice, Parvesh Sir and our team are here to guide you.</p>
    `,
    "Welcome to Prime Commerce Hub"
  );

  return sendEmail(recipient.email, "Welcome to Prime Commerce Hub!", html, {
    templateType: "WELCOME",
    relatedEntityId: recipient.email,
  });
}

/**
 * 2. Payment & Enrollment Confirmation Email
 */
export async function sendPaymentSuccessEmail(params: {
  recipient: EmailRecipient;
  itemName: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 22px; font-weight: 800; margin-top: 0;">Payment Confirmed &amp; Access Unlocked</h2>
    <p>Hello <strong>${params.recipient.name}</strong>,</p>
    <p>Your payment has been successfully processed. Access to <strong>${params.itemName}</strong> is now activated on your account.</p>
    
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Item / Course:</span>
        <span class="info-value">${params.itemName}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amount Paid:</span>
        <span class="info-value">₹${params.amount.toLocaleString("en-IN")}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction ID:</span>
        <span class="info-value" style="font-family: monospace;">${params.transactionId}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Date:</span>
        <span class="info-value">${params.paymentDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Access Status:</span>
        <span class="info-value" style="color: #059669;">Active (Instant Access)</span>
      </div>
    </div>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" class="btn">Go to Student Dashboard</a>
    </div>

    <p style="font-size: 13px; color: #6b7280;">You can stream purchased lectures and download included revision notes anytime from your student profile.</p>
    `,
    `Payment Receipt: ${params.itemName}`
  );

  return sendEmail(params.recipient.email, `Enrollment Confirmed: ${params.itemName}`, html, {
    templateType: "PAYMENT_SUCCESS",
    relatedEntityId: params.transactionId,
  });
}

/**
 * 3. Administrator Notification for New Enrollment
 */
export async function sendAdminNewEnrollmentEmail(params: {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  amount: number;
  transactionId: string;
}) {
  const adminEmails = [
    "parveshdhiman1900@gmail.com",
    "akshit2046@gmail.com",
    (process.env.ADMIN_EMAIL || "").toLowerCase(),
  ].filter(Boolean);

  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 20px; font-weight: 800; margin-top: 0;">New Student Enrolled</h2>
    <p>A new course enrollment has been completed on Prime Commerce Hub.</p>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Student:</span>
        <span class="info-value">${params.studentName} (${params.studentEmail})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Course:</span>
        <span class="info-value">${params.courseTitle}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Amount:</span>
        <span class="info-value">₹${params.amount.toLocaleString("en-IN")}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Transaction Reference:</span>
        <span class="info-value">${params.transactionId}</span>
      </div>
    </div>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/orders" class="btn">View in Admin Portal</a>
    </div>
    `,
    `New Enrollment: ${params.courseTitle}`
  );

  for (const adminEmail of adminEmails) {
    await sendEmail(adminEmail, `[Admin Alert] New Enrollment: ${params.courseTitle}`, html, {
      templateType: "ADMIN_NEW_ENROLLMENT",
      relatedEntityId: `${params.transactionId}_${adminEmail}`,
    });
  }
}

/**
 * 4. Payment Failed Notification
 */
export async function sendPaymentFailedEmail(params: {
  recipient: EmailRecipient;
  itemName: string;
  amount: number;
}) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #dc2626; font-size: 22px; font-weight: 800; margin-top: 0;">Payment Could Not Be Completed</h2>
    <p>Hello <strong>${params.recipient.name}</strong>,</p>
    <p>We noticed that your attempt to purchase <strong>${params.itemName}</strong> (₹${params.amount.toLocaleString("en-IN")}) did not complete successfully.</p>
    <p>No funds were deducted. If an amount was debited from your bank, Razorpay will automatically reverse it within 3-5 business days.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses" class="btn">Retry Payment</a>
    </div>
    `,
    "Payment Alert: Action Required"
  );

  return sendEmail(params.recipient.email, "Notice: Payment Incomplete", html, {
    templateType: "PAYMENT_FAILED",
    relatedEntityId: `${params.recipient.email}_${Date.now()}`,
  });
}
