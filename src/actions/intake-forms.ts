"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import type { IntakeFormField } from "@/types/database";

export async function getIntakeForms() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("intake_forms")
    .select("*")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getIntakeForm(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("intake_forms")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function createIntakeForm(name: string, fields: IntakeFormField[]) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("intake_forms")
    .insert({ org_id: userData.orgId, name, fields })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/forms");
  return { success: true, id: data.id };
}

export async function updateIntakeForm(id: string, name: string, fields: IntakeFormField[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("intake_forms")
    .update({ name, fields })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/forms");
  return { success: true };
}

export async function sendIntakeForm(formId: string, inquiryId: string, clientId: string) {
  const userData = await getUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("intake_responses")
    .insert({
      form_id: formId,
      inquiry_id: inquiryId,
      client_id: clientId,
    })
    .select("access_token")
    .single();

  if (error) return { error: error.message };

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim();
  const link = `${appUrl}/form/${data.access_token}`;

  // Send email to client with form link
  const admin = createAdminClient();
  const { data: client } = await admin
    .from("clients")
    .select("name, email")
    .eq("id", clientId)
    .single();

  const { data: form } = await admin
    .from("intake_forms")
    .select("name")
    .eq("id", formId)
    .single();

  const studioName = userData?.organization?.name || "Our Studio";

  if (client?.email) {
    await sendEmail({
      to: client.email,
      subject: `${studioName} — Please fill out your event details`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #f97316, #ec4899); padding: 3px; border-radius: 12px;">
            <div style="background: white; border-radius: 10px; padding: 32px;">
              <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #18181b;">We'd love to learn more!</h2>
              <p style="margin: 0 0 24px 0; color: #71717a; font-size: 14px;">
                Hi ${client.name}, ${studioName} has sent you a questionnaire to collect details about your event.
              </p>
              <p style="color: #3f3f46; font-size: 14px; line-height: 1.6;">
                Please fill out the <strong>${form?.name || "event details form"}</strong> so we can prepare everything for your special day. It only takes a few minutes.
              </p>
              <a href="${link}" style="display: inline-block; margin-top: 24px; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #ec4899); color: white; text-decoration: none; border-radius: 8px; font-size: 15px; font-weight: 600;">Fill Out Details</a>
              <p style="margin-top: 24px; font-size: 12px; color: #a1a1aa;">If the button doesn't work, copy this link:<br/>${link}</p>
            </div>
          </div>
          <p style="text-align: center; margin-top: 16px; font-size: 12px; color: #a1a1aa;">Sent by StudioFlow on behalf of ${studioName}</p>
        </div>
      `,
    });
  }

  return { success: true, link };
}

export async function getIntakeFormByToken(token: string) {
  const admin = createAdminClient();
  const { data: response } = await admin
    .from("intake_responses")
    .select("*, intake_forms(*)")
    .eq("access_token", token)
    .single();

  return response;
}

export async function submitIntakeResponse(token: string, answers: Record<string, unknown>) {
  const admin = createAdminClient();
  const { error } = await admin
    .from("intake_responses")
    .update({ answers, submitted_at: new Date().toISOString() })
    .eq("access_token", token);

  if (error) return { error: error.message };
  return { success: true };
}
