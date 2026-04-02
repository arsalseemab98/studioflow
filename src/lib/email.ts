import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type CompanyInfo = {
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  primary_color?: string | null;
};

function getFromEmail(company?: CompanyInfo) {
  // Resend free tier only allows onboarding@resend.dev
  // With custom domain, could use company.email
  const name = company?.name || "StudioFlow";
  return `${name} <onboarding@resend.dev>`;
}

function companyFooter(company: CompanyInfo) {
  const parts: string[] = [];
  if (company.email) parts.push(`<a href="mailto:${company.email}" style="color: #a1a1aa; text-decoration: none;">${company.email}</a>`);
  if (company.phone) parts.push(`<span>${company.phone}</span>`);
  if (company.website) parts.push(`<a href="${company.website}" style="color: #a1a1aa; text-decoration: none;">${company.website.replace(/https?:\/\//, "")}</a>`);
  if (company.address) parts.push(`<span>${company.address}</span>`);

  const contactLine = parts.length > 0
    ? `<p style="text-align: center; margin-top: 8px; font-size: 11px; color: #a1a1aa;">${parts.join(" &middot; ")}</p>`
    : "";

  const color = company.primary_color || "#f97316";

  return `
    <div style="text-align: center; margin-top: 16px;">
      <p style="font-size: 12px; color: #71717a; font-weight: 600;">${company.name}</p>
      ${contactLine}
      <p style="font-size: 11px; color: #d4d4d8; margin-top: 8px;">Powered by StudioFlow</p>
    </div>
  `;
}

function gradientStyle(company?: CompanyInfo) {
  const color = company?.primary_color || "#f97316";
  return `background: linear-gradient(135deg, ${color}, #ec4899)`;
}

export async function sendEmail({
  to,
  subject,
  html,
  company,
}: {
  to: string;
  subject: string;
  html: string;
  company?: CompanyInfo;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(company),
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
  company,
  clientName,
  eventType,
  eventDate,
  location,
  dashboardUrl,
}: {
  company: CompanyInfo;
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
        <div style="${gradientStyle(company)}; padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">New Inquiry Received</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">${company.name} has a new lead</p>
            <table style="width: 100%; font-size: 14px; color: #3f3f46;">
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Client</td><td style="padding: 8px 0; font-weight: 600;">${clientName}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Event Type</td><td style="padding: 8px 0; text-transform: capitalize;">${eventType}</td></tr>
              ${eventDate ? `<tr><td style="padding: 8px 0; color: #a1a1aa;">Date</td><td style="padding: 8px 0;">${eventDate}</td></tr>` : ""}
              ${location ? `<tr><td style="padding: 8px 0; color: #a1a1aa;">Location</td><td style="padding: 8px 0;">${location}</td></tr>` : ""}
            </table>
            <a href="${dashboardUrl}" style="display: inline-block; margin-top: 24px; padding: 12px 24px; ${gradientStyle(company)}; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">View in Dashboard</a>
          </div>
        </div>
        ${companyFooter(company)}
      </div>
    `,
  };
}

export function detailsFormEmail({
  company,
  clientName,
  formName,
  formLink,
}: {
  company: CompanyInfo;
  clientName: string;
  formName: string;
  formLink: string;
}) {
  return {
    subject: `${company.name} — Please fill out your event details`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="${gradientStyle(company)}; padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">We'd love to learn more!</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">
              Hi ${clientName}, ${company.name} has sent you a questionnaire to collect details about your event.
            </p>
            <p style="color: #3f3f46; font-size: 14px; line-height: 1.6;">
              Please fill out the <strong>${formName}</strong> so we can prepare everything for your special day. It only takes a few minutes.
            </p>
            <a href="${formLink}" style="display: inline-block; margin-top: 24px; padding: 14px 32px; ${gradientStyle(company)}; color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">Fill Out Details</a>
            <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">If the button doesn't work, copy this link:<br/>${formLink}</p>
          </div>
        </div>
        ${companyFooter(company)}
      </div>
    `,
  };
}

export function contractSentEmail({
  company,
  clientName,
  signingLink,
}: {
  company: CompanyInfo;
  clientName: string;
  signingLink: string;
}) {
  return {
    subject: `${company.name} — Contract ready for your signature`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="${gradientStyle(company)}; padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">You have a contract to sign</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">Hi ${clientName}, ${company.name} has sent you a service agreement.</p>
            <p style="color: #3f3f46; font-size: 14px; line-height: 1.6;">Please review the contract details and sign digitally by clicking the button below. The process takes less than a minute.</p>
            <a href="${signingLink}" style="display: inline-block; margin-top: 24px; padding: 14px 32px; ${gradientStyle(company)}; color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">Review & Sign Contract</a>
            <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">If the button doesn't work, copy this link:<br/>${signingLink}</p>
          </div>
        </div>
        ${companyFooter(company)}
      </div>
    `,
  };
}

export function contractSignedEmail({
  company,
  clientName,
  dashboardUrl,
}: {
  company: CompanyInfo;
  clientName: string;
  dashboardUrl: string;
}) {
  return {
    subject: `${clientName} signed the contract!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="${gradientStyle(company)}; padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">&#10003;</div>
            <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">Contract Signed!</h2>
            <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">${clientName} has signed the service agreement. A booking has been automatically created.</p>
            <a href="${dashboardUrl}" style="display: inline-block; padding: 12px 24px; ${gradientStyle(company)}; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600;">View Booking</a>
          </div>
        </div>
        ${companyFooter(company)}
      </div>
    `,
  };
}

export function bookingConfirmationEmail({
  company,
  clientName,
  eventDate,
  location,
  price,
}: {
  company: CompanyInfo;
  clientName: string;
  eventDate: string;
  location: string;
  price: string;
}) {
  return {
    subject: `Booking confirmed with ${company.name}!`,
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <div style="${gradientStyle(company)}; padding: 3px; border-radius: 12px;">
          <div style="background: white; border-radius: 10px; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 48px;">&#127881;</div>
              <h2 style="margin: 8px 0 0 0; font-size: 20px; color: #18181b;">Booking Confirmed!</h2>
            </div>
            <p style="color: #71717a; font-size: 14px; margin-bottom: 24px;">Hi ${clientName}, your event with ${company.name} is confirmed. Here are the details:</p>
            <table style="width: 100%; font-size: 14px; color: #3f3f46;">
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Date</td><td style="padding: 8px 0; font-weight: 600;">${eventDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Location</td><td style="padding: 8px 0;">${location}</td></tr>
              <tr><td style="padding: 8px 0; color: #a1a1aa;">Total</td><td style="padding: 8px 0; font-weight: 600; color: ${company.primary_color || "#f97316"};">${price}</td></tr>
            </table>
            <p style="margin-top: 24px; font-size: 13px; color: #a1a1aa;">If you have any questions, contact ${company.name} directly.</p>
          </div>
        </div>
        ${companyFooter(company)}
      </div>
    `,
  };
}
