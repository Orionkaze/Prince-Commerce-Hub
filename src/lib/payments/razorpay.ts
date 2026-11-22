import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export const isRazorpayConfigured = Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

export const razorpayInstance = isRazorpayConfigured
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    })
  : null;

/**
 * Create a new Razorpay Order for course or lecture purchase
 */
export async function createRazorpayOrder(params: {
  amountInINR: number;
  receiptId: string;
  notes?: Record<string, string>;
}): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  isMock: boolean;
}> {
  const amountInPaise = Math.round(params.amountInINR * 100);

  if (!razorpayInstance) {
    // Development fallback order
    const mockOrderId = `order_mock_${Date.now()}`;
    return {
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID || "rzp_test_placeholder",
      isMock: true,
    };
  }

  const order = await razorpayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: params.receiptId,
    notes: params.notes,
  });

  return {
    orderId: order.id,
    amount: order.amount as number,
    currency: order.currency,
    keyId: RAZORPAY_KEY_ID,
    isMock: false,
  };
}

/**
 * Verify Razorpay payment signature
 * crypto.createHmac('sha256', secret).update(order_id + "|" + payment_id).digest('hex') === signature
 */
export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!isRazorpayConfigured) {
    // If in development and testing mock payment
    if (params.orderId.startsWith("order_mock_")) {
      return true;
    }
  }

  if (!RAZORPAY_KEY_SECRET) return false;

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${params.orderId}|${params.paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(generatedSignature),
    Buffer.from(params.signature)
  );
}

/**
 * Verify Webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!RAZORPAY_WEBHOOK_SECRET) return true;

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
}
