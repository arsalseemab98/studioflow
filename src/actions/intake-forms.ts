"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";
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

  const link = `${process.env.NEXT_PUBLIC_APP_URL}/form/${data.access_token}`;
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
