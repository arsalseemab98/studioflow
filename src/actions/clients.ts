"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";

export async function getClients(search?: string) {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  let query = supabase
    .from("clients")
    .select("*")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

export async function getClient(id: string) {
  const supabase = await createClient();

  const [client, inquiries, bookings, contracts] = await Promise.all([
    supabase.from("clients").select("*").eq("id", id).single(),
    supabase
      .from("inquiries")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("bookings")
      .select("*")
      .eq("client_id", id)
      .order("event_date", { ascending: false }),
    supabase
      .from("contracts")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    client: client.data,
    inquiries: inquiries.data || [],
    bookings: bookings.data || [],
    contracts: contracts.data || [],
  };
}

export async function createClientAction(formData: FormData) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({
    org_id: userData.orgId,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    notes: formData.get("notes") as string,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/clients");
  return { success: true };
}

export async function updateClientAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .update({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      notes: formData.get("notes") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/clients");
  return { success: true };
}
