import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.EMAIL_FROM || "Prime Commerce Hub <admissions@primecommercehub.com>";

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
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e5e7eb; }
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
      <p>Prime Commerce Hub — Expert Accountancy Coaching for Class 11th &amp; 12th Commerce</p>
      <p>Founder &amp; Lead Educator: Parvesh Kumar (30+ Years Exp)</p>
      <p>Questions? Contact us at <a href="mailto:parveshdhiman1900@gmail.com" style="color: #5b32d6;">parveshdhiman1900@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * 1. Welcome Email
 */
export async function sendWelcomeEmail(recipient: EmailRecipient) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 22px; font-weight: 800; margin-top: 0;">Welcome to Prime Commerce Hub!</h2>
    <p>Hello <strong>${recipient.name}</strong>,</p>
    <p>Your student account has been created. You now have access to explore free accountancy study materials, sample formula sheets, and enrolled batch recordings led by Parvesh Sir.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses" class="btn">Explore Courses &amp; Batches</a>
    </div>
    <p style="font-size: 13px; color: #6b7280;">If you ever need personalized course counseling or batch advice, Parvesh Sir and our team are here to guide you.</p>
    `,
    "Welcome to Prime Commerce Hub"
  );

  return sendEmail(recipient.email, "Welcome to Prime Commerce Hub!", html);
}

/**
 * 2. Payment & Enrollment Confirmation
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
      <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/courses" class="btn">Start Learning Now</a>
    </div>

    <p style="font-size: 13px; color: #6b7280;">You can stream purchased lectures and download included revision notes anytime from your student profile.</p>
    `,
    `Payment Receipt: ${params.itemName}`
  );

  return sendEmail(params.recipient.email, `Enrollment Confirmed: ${params.itemName}`, html);
}

/**
 * 3. Payment Failed Notification
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

  return sendEmail(params.recipient.email, "Notice: Payment Incomplete", html);
}

/**
 * 4. New Content Upload Notification
 */
export async function sendNewContentNotification(params: {
  recipient: EmailRecipient;
  contentTitle: string;
  contentType: string;
  subject: string;
  accessUrl: string;
}) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 22px; font-weight: 800; margin-top: 0;">New ${params.contentType} Available</h2>
    <p>Hello <strong>${params.recipient.name}</strong>,</p>
    <p>Parvesh Sir has just uploaded new learning material in <strong>${params.subject}</strong>:</p>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Title:</span>
        <span class="info-value">${params.contentTitle}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Type:</span>
        <span class="info-value">${params.contentType}</span>
      </div>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${params.accessUrl}" class="btn">View New Content</a>
    </div>
    `,
    `New Content: ${params.contentTitle}`
  );

  return sendEmail(params.recipient.email, `New ${params.contentType}: ${params.contentTitle}`, html);
}

/**
 * 5. Refund Confirmation Email
 */
export async function sendRefundConfirmationEmail(params: {
  recipient: EmailRecipient;
  itemName: string;
  amount: number;
  refundId: string;
}) {
  const html = wrapEmailTemplate(
    `
    <h2 style="color: #16141b; font-size: 22px; font-weight: 800; margin-top: 0;">Refund Processed</h2>
    <p>Hello <strong>${params.recipient.name}</strong>,</p>
    <p>A refund of <strong>₹${params.amount.toLocaleString("en-IN")}</strong> for <strong>${params.itemName}</strong> has been initiated.</p>
    <div class="info-card">
      <div class="info-row">
        <span class="info-label">Refund Reference:</span>
        <span class="info-value" style="font-family: monospace;">${params.refundId}</span>
      </div>
    </div>
    <p style="font-size: 13px; color: #6b7280;">Refunds typically appear in your original payment method in 5-7 business days.</p>
    `,
    "Refund Confirmation"
  );

  return sendEmail(params.recipient.email, `Refund Confirmation: ${params.itemName}`, html);
}

/**
 * Generic mail dispatcher with console fallback for local testing
 */
async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log(`[EMAIL LOG - DEV MODE]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`(Configure RESEND_API_KEY in .env.local to send live emails)`);
    return { success: true, simulated: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Resend Email Error:", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
    return { success: false, error: err };
  }
}
