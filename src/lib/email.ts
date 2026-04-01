import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "StudioFlow <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    if (error) {
      console.error("Email error:", error);
      return { error: error.message };
    }
    return { success: true, id: data?.id };
  } catch (err) {
    console.error("Email send failed:", err);
    return { error: "Failed to send email" };
  }
}

// Email templates

export function inquiryReceivedEmail({
  studioName,
  clientName,
  eventType,
  eventDate,
  location,
  dashboardUrl,
}: {
  studioName: string;
  clientName: string;
  eventType: string;
  eventDate: string | null;
  location: string | null;
  dashboardUrl: string;
}) {
  return {
    subject: `New inquiry from ${clientName}`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">New Inquiry Received</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">${studioName} has a new lead</p>
            <table style="width: 100%; font-size: 14px; color: #3f3f46;">
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Client</td><td style="padding: 8px 0; font-weight: 600;">${clientName}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Event Type</td><td style="padding: 8px 0; text-transform: capitalize;">${eventType}</td></tr>
              ${eventDate ? `<tr><td style="padding: 8px 0; color: #a1a1aa;">Date</td><td style="padding: 8px 0;">${eventDate}</td></tr>` : ""}
              ${location ? `<tr><td style="padding: 8px 0; color: #a1a1aa;">Location</td><td style="padding: 8px 0;">${location}</td></tr>` : ""}
            </table>
            <a href="${dashboardUrl}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background: linear-gradient(135deg, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">View in Dashboard</a>
          </div>
        </div>
        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a1a1aa;">Sent by StudioFlow</p>
      </div>
    `,
  };
}

export function contractSentEmail({
  clientName,
  studioName,
  signingLink,
}: {
  clientName: string;
  studioName: string;
  signingLink: string;
}) {
  return {
    subject: `Contract from ${studioName} — please review and sign`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">You have a contract to sign</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">Hi ${clientName}, ${studioName} has sent you a service agreement.</p>
            <p style="color: #3f3f46; font-size: 14px; line-height: 1.6;">Please review the contract details and sign digitally by clicking the button below. The process takes less than a minute.</p>
            <a href="${signingLink}" style="display: inline-block; margin-top: 24px; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">Review & Sign Contract</a>
            <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">If the button doesn't work, copy this link:<br/>${signingLink}</p>
          </div>
        </div>
        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a1a1aa;">Sent by StudioFlow on behalf of ${studioName}</p>
      </div>
    `,
  };
}

export function contractSignedEmail({
  studioName,
  clientName,
  dashboardUrl,
}: {
  studioName: string;
  clientName: string;
  dashboardUrl: string;
}) {
  return {
    subject: `${clientName} signed the contract!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">Contract Signed!</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">${clientName} has signed the service agreement. A booking has been automatically created.</p>
            <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">View Booking</a>
          </div>
        </div>
        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a1a1aa;">Sent by StudioFlow</p>
      </div>
    `,
  };
}

export function bookingConfirmationEmail({
  clientName,
  studioName,
  eventDate,
  location,
  price,
}: {
  clientName: string;
  studioName: string;
  eventDate: string;
  location: string;
  price: string;
}) {
  return {
    subject: `Booking confirmed with ${studioName}!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 48px;">&#127881;</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; color: #18181b;">Booking Confirmed!</h2>
            </div>
            <p style="color: #71717a; font-size: 14px; margin-bottom: 24px;">Hi ${clientName}, your event with ${studioName} is confirmed. Here are the details:</p>
            <table style="width: 100%; font-size: 14px; color: #3f3f46;">
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Date</td><td style="padding: 8px 0; font-weight: 600;">${eventDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Location</td><td style="padding: 8px 0;">${location}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Total</td><td style="padding: 8px 0; font-weight: 600; color: #f97316;">${price}</td></tr>
            </table>
            <p style="margin-top: 24px; font-size: 13px; color: #a1a1aa;">If you have any questions, reply to this email or contact ${studioName} directly.</p>
          </div>
        </div>
        <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a1a1aa;">Sent by StudioFlow on behalf of ${studioName}</p>
      </div>
    `,
  };
}
