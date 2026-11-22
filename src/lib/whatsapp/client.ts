/**
 * WhatsApp Business Cloud API Integration Module
 * Architecture-ready for Meta WhatsApp Cloud API
 */

export interface WhatsAppMessagePayload {
  toPhoneNumber: string; // E.164 format, e.g. "919876543210"
  templateName: string;
  languageCode?: string;
  parameters: string[];
}

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN || "";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
export const isWhatsAppConfigured = Boolean(WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_NUMBER_ID);

/**
 * Dispatch an automated WhatsApp template notification
 */
export async function sendWhatsAppNotification(
  payload: WhatsAppMessagePayload
): Promise<{ success: boolean; data?: any; error?: any; simulated?: boolean }> {
  // Clean phone number (strip whitespace, +, -)
  const cleanPhone = payload.toPhoneNumber.replace(/[^0-9]/g, "");

  if (!isWhatsAppConfigured) {
    console.log(`[WHATSAPP LOG - DEV MODE]`);
    console.log(`To: +${cleanPhone}`);
    console.log(`Template: ${payload.templateName}`);
    console.log(`Parameters: ${payload.parameters.join(", ")}`);
    console.log(`(Configure WHATSAPP_ACCESS_TOKEN & WHATSAPP_PHONE_NUMBER_ID in .env.local to send live WhatsApp messages)`);
    return { success: true, simulated: true };
  }

  try {
    const endpoint = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanPhone,
        type: "template",
        template: {
          name: payload.templateName,
          language: { code: payload.languageCode || "en" },
          components: [
            {
              type: "body",
              parameters: payload.parameters.map((text) => ({
                type: "text",
                text,
              })),
            },
          ],
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return { success: false, error: data };
    }

    return { success: true, data };
  } catch (error) {
    console.error("WhatsApp notification dispatch failed:", error);
    return { success: false, error };
  }
}

/**
 * Helper triggers for common LMS events
 */
export async function notifyEnrollmentViaWhatsApp(params: {
  phone: string;
  studentName: string;
  courseName: string;
}) {
  return sendWhatsAppNotification({
    toPhoneNumber: params.phone,
    templateName: "course_enrollment_confirmation",
    parameters: [params.studentName, params.courseName],
  });
}

export async function notifyNewContentViaWhatsApp(params: {
  phone: string;
  studentName: string;
  contentTitle: string;
}) {
  return sendWhatsAppNotification({
    toPhoneNumber: params.phone,
    templateName: "new_lecture_uploaded",
    parameters: [params.studentName, params.contentTitle],
  });
}
