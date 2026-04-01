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

  // Auto-create tentative booking with data from contract
  if (contract.client_id) {
    const blocks = contract.content as { type: string; fieldName?: string; fieldValue?: string; content?: string }[];

    // Extract fields from contract content
    let eventDate = new Date().toISOString().split("T")[0];
    let location = "";
    let price = 0;
    let eventType = "";

    for (const block of blocks) {
      if (block.type === "field") {
        if (block.fieldName === "event_date" && block.fieldValue) {
          eventDate = block.fieldValue;
        }
        if (block.fieldName === "location" && block.fieldValue) {
          location = block.fieldValue;
        }
        if (block.fieldName === "price" && block.fieldValue) {
          price = Number(block.fieldValue.replace(/[^0-9.]/g, "")) || 0;
        }
      }
      if (block.type === "heading" && block.content) {
        // Extract event type from heading like "Wedding Photography Service Agreement"
        const heading = block.content.toLowerCase();
        if (heading.includes("wedding")) eventType = "wedding";
        else if (heading.includes("engagement")) eventType = "engagement";
        else if (heading.includes("portrait")) eventType = "portrait";
        else if (heading.includes("corporate")) eventType = "corporate";
      }
    }

    // Get client name for booking title
    const { data: client } = await admin
      .from("clients")
      .select("name")
      .eq("id", contract.client_id)
      .single();

    await admin.from("bookings").insert({
      org_id: contract.org_id,
      client_id: contract.client_id,
      contract_id: contract.id,
      inquiry_id: contract.inquiry_id,
      title: client?.name ? `${client.name} — ${eventType || "Event"}` : "Booking from signed contract",
      event_type: eventType || null,
      event_date: eventDate,
      location,
      total_price: price,
      status: "confirmed",
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
