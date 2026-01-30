import { Resend } from "resend";

// Lazy initialization to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.EMAIL_FROM || "Zimbabwe Arrival Card <noreply@immigration.gov.zw>";

interface ArrivalCardEmailData {
  to: string;
  firstName: string;
  lastName: string;
  referenceNumber: string;
  arrivalDate: Date;
  qrCodeUrl?: string;
}

/**
 * Send arrival card confirmation email
 */
export async function sendArrivalCardConfirmation(data: ArrivalCardEmailData) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return { success: false, error: "Email not configured" };
  }

  const formattedDate = data.arrivalDate.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: `Zimbabwe e-Arrival Card Confirmed - ${data.referenceNumber}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zimbabwe e-Arrival Card Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #319B4B; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Zimbabwe e-Arrival Card</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">Department of Immigration</p>
  </div>

  <div style="padding: 30px 20px; background-color: #f9f9f9;">
    <h2 style="color: #319B4B; margin-top: 0;">Your Arrival Card is Confirmed!</h2>

    <p>Dear ${data.firstName} ${data.lastName},</p>

    <p>Your Zimbabwe e-Arrival Card has been successfully submitted and is ready for your arrival.</p>

    <div style="background-color: white; border: 2px solid #319B4B; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #333;">Reference Number</h3>
      <p style="font-size: 28px; font-weight: bold; color: #319B4B; margin: 10px 0; font-family: monospace; letter-spacing: 2px;">
        ${data.referenceNumber}
      </p>
      <p style="color: #666; font-size: 14px; margin-bottom: 0;">
        Arrival Date: <strong>${formattedDate}</strong>
      </p>
    </div>

    <h3 style="color: #333;">What to do next:</h3>
    <ol style="color: #555;">
      <li style="margin-bottom: 10px;">Save this email or take a screenshot of your reference number</li>
      <li style="margin-bottom: 10px;">Present your QR code or reference number at immigration upon arrival</li>
      <li style="margin-bottom: 10px;">Have your passport ready for verification</li>
    </ol>

    <div style="background-color: #FFF8E1; border-left: 4px solid #FFD100; padding: 15px; margin: 20px 0;">
      <strong style="color: #B8860B;">Important:</strong>
      <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #666;">
        <li>This e-Arrival Card is NOT a visa</li>
        <li>Ensure you have the required visa if applicable</li>
        <li>Your arrival card is valid for the dates specified</li>
      </ul>
    </div>

    <p style="margin-top: 30px;">
      <a href="${process.env.NEXTAUTH_URL}/arrival-card/lookup"
         style="background-color: #319B4B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        View Your e-Pass
      </a>
    </p>
  </div>

  <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
    <p style="margin: 0;">Republic of Zimbabwe - Department of Immigration</p>
    <p style="margin: 5px 0 0 0; color: #999;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
</body>
</html>
      `,
      text: `
Zimbabwe e-Arrival Card - Confirmation

Dear ${data.firstName} ${data.lastName},

Your Zimbabwe e-Arrival Card has been successfully submitted.

REFERENCE NUMBER: ${data.referenceNumber}
ARRIVAL DATE: ${formattedDate}

What to do next:
1. Save this email or take a screenshot of your reference number
2. Present your QR code or reference number at immigration upon arrival
3. Have your passport ready for verification

Important:
- This e-Arrival Card is NOT a visa
- Ensure you have the required visa if applicable
- Your arrival card is valid for the dates specified

View your e-Pass: ${process.env.NEXTAUTH_URL}/arrival-card/lookup

Republic of Zimbabwe - Department of Immigration
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}

/**
 * Send status update email
 */
export async function sendStatusUpdateEmail(data: {
  to: string;
  firstName: string;
  lastName: string;
  referenceNumber: string;
  status: "APPROVED" | "REJECTED" | "UNDER_REVIEW";
  reason?: string;
}) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("RESEND_API_KEY not set, skipping email");
    return { success: false, error: "Email not configured" };
  }

  const statusMessages = {
    APPROVED: {
      subject: `Approved - Zimbabwe e-Arrival Card ${data.referenceNumber}`,
      heading: "Your Arrival Card is Approved!",
      message: "Your Zimbabwe e-Arrival Card has been approved. You are ready for your journey!",
      color: "#319B4B",
    },
    REJECTED: {
      subject: `Action Required - Zimbabwe e-Arrival Card ${data.referenceNumber}`,
      heading: "Arrival Card Requires Attention",
      message: `Your Zimbabwe e-Arrival Card requires attention. ${data.reason || "Please contact immigration for more information."}`,
      color: "#DE2010",
    },
    UNDER_REVIEW: {
      subject: `Under Review - Zimbabwe e-Arrival Card ${data.referenceNumber}`,
      heading: "Your Arrival Card is Under Review",
      message: "Your Zimbabwe e-Arrival Card is currently being reviewed by immigration officials. You will be notified once a decision is made.",
      color: "#FFD100",
    },
  };

  const status = statusMessages[data.status];

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.to,
      subject: status.subject,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #319B4B; padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">Zimbabwe e-Arrival Card</h1>
  </div>

  <div style="padding: 30px 20px; background-color: #f9f9f9;">
    <h2 style="color: ${status.color}; margin-top: 0;">${status.heading}</h2>

    <p>Dear ${data.firstName} ${data.lastName},</p>

    <p>${status.message}</p>

    <div style="background-color: white; border: 2px solid ${status.color}; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="margin: 0; color: #666;">Reference Number:</p>
      <p style="font-size: 24px; font-weight: bold; color: ${status.color}; margin: 5px 0; font-family: monospace;">
        ${data.referenceNumber}
      </p>
    </div>

    <p>
      <a href="${process.env.NEXTAUTH_URL}/arrival-card/lookup"
         style="background-color: #319B4B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
        Check Status
      </a>
    </p>
  </div>

  <div style="background-color: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
    <p style="margin: 0;">Republic of Zimbabwe - Department of Immigration</p>
  </div>
</body>
</html>
      `,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send status email:", error);
    return { success: false, error };
  }
}
