"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";
import type { ContractBlock } from "@/types/database";

export async function getContractTemplates() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getContracts(status?: string) {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  let query = supabase
    .from("contracts")
    .select("*, clients(name, email)")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data || [];
}

export async function getContract(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contracts")
    .select("*, clients(name, email, phone)")
    .eq("id", id)
    .single();
  return data;
}

export async function createContract(
  clientId: string,
  templateId: string | null,
  content: ContractBlock[],
  inquiryId?: string
) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contracts")
    .insert({
      org_id: userData.orgId,
      client_id: clientId,
      template_id: templateId,
      inquiry_id: inquiryId || null,
      content,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/dashboard/contracts");
  return { success: true, id: data.id };
}

export async function sendContract(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contracts")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/contracts");
  return { success: true };
}

export async function getContractByToken(token: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("contracts")
    .select("*, clients(name, email)")
    .eq("access_token", token)
    .single();

  // Mark as viewed if first time
  if (data && data.status === "sent") {
    await admin
      .from("contracts")
      .update({ status: "viewed", viewed_at: new Date().toISOString() })
      .eq("id", data.id);
  }

  return data;
}

export async function signContract(token: string, signatureData: string) {
  const admin = createAdminClient();

  // Get contract
  const { data: contract } = await admin
    .from("contracts")
    .select("id, org_id, client_id, inquiry_id, content")
    .eq("access_token", token)
    .single();

  if (!contract) return { error: "Contract not found" };

  // Update contract
  const { error } = await admin
    .from("contracts")
    .update({
      status: "signed",
      signed_at: new Date().toISOString(),
      signature_data: signatureData,
    })
    .eq("id", contract.id);

  if (error) return { error: error.message };

  // Auto-create tentative booking
  if (contract.client_id) {
    await admin.from("bookings").insert({
      org_id: contract.org_id,
      client_id: contract.client_id,
      contract_id: contract.id,
      inquiry_id: contract.inquiry_id,
      title: "Booking from signed contract",
      event_date: new Date().toISOString().split("T")[0],
      status: "tentative",
    });
  }

  // Log workflow
  await admin.from("workflow_logs").insert({
    org_id: contract.org_id,
    inquiry_id: contract.inquiry_id,
    action: "contract_signed",
    metadata: { contract_id: contract.id },
  });

  return { success: true };
}
