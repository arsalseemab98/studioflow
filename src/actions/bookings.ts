"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";

export async function getBookings(month?: string) {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select("*, clients(name, email)")
    .eq("org_id", userData.orgId)
    .order("event_date", { ascending: true });

  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    query = query.gte("event_date", start).lte("event_date", end);
  }

  const { data } = await query;
  return data || [];
}

export async function getBooking(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("*, clients(name, email, phone)")
    .eq("id", id)
    .single();
  return data;
}

export async function createBooking(formData: FormData) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const supabase = await createClient();
  const eventDate = formData.get("event_date") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;

  // Double booking check
  if (startTime && endTime) {
    const { data: existing } = await supabase
      .from("bookings")
      .select("id")
      .eq("org_id", userData.orgId)
      .eq("event_date", eventDate)
      .neq("status", "cancelled")
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (existing && existing.length > 0) {
      return { error: "Time slot conflicts with an existing booking" };
    }
  }

  const { error } = await supabase.from("bookings").insert({
    org_id: userData.orgId,
    client_id: formData.get("client_id") as string,
    title: formData.get("title") as string,
    event_type: formData.get("event_type") as string,
    event_date: eventDate,
    start_time: startTime ? `${eventDate}T${startTime}` : null,
    end_time: endTime ? `${eventDate}T${endTime}` : null,
    location: formData.get("location") as string,
    total_price: Number(formData.get("total_price")) || 0,
    notes: formData.get("notes") as string,
    status: "tentative",
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/bookings");
  return { success: true };
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/bookings");
  return { success: true };
}
