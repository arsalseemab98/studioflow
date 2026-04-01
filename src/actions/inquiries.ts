"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";

export async function getInquiries(status?: string) {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  let query = supabase
    .from("inquiries")
    .select("*, clients(name, email)")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data || [];
}

export async function getInquiry(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inquiries")
    .select("*, clients(name, email, phone)")
    .eq("id", id)
    .single();
  return data;
}

export async function submitPublicInquiry(orgSlug: string, formData: FormData) {
  const admin = createAdminClient();

  // Find org by slug
  const { data: org } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", orgSlug)
    .single();

  if (!org) return { error: "Organization not found" };

  // Create or find client
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  let clientId: string;
  const { data: existing } = await admin
    .from("clients")
    .select("id")
    .eq("org_id", org.id)
    .eq("email", email)
    .single();

  if (existing) {
    clientId = existing.id;
  } else {
    const { data: newClient } = await admin
      .from("clients")
      .insert({
        org_id: org.id,
        name,
        email,
        phone: formData.get("phone") as string,
      })
      .select("id")
      .single();
    if (!newClient) return { error: "Failed to create client" };
    clientId = newClient.id;
  }

  // Create inquiry
  const { error } = await admin.from("inquiries").insert({
    org_id: org.id,
    client_id: clientId,
    event_type: formData.get("event_type") as string,
    event_date: formData.get("event_date") as string || null,
    location: formData.get("location") as string,
    budget: formData.get("budget") ? Number(formData.get("budget")) : null,
    message: formData.get("message") as string,
  });

  if (error) return { error: error.message };

  // Log workflow
  await admin.from("workflow_logs").insert({
    org_id: org.id,
    action: "inquiry_received",
    metadata: { client_name: name, email },
  });

  return { success: true };
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/inquiries");
  return { success: true };
}
