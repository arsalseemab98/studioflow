"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";

export async function getDashboardStats() {
  const userData = await getUser();
  if (!userData?.orgId) return null;

  const supabase = await createClient();
  const orgId = userData.orgId;

  const [bookings, inquiries, contracts, revenue] = await Promise.all([
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .neq("status", "cancelled"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "new"),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "signed"),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("org_id", orgId)
      .in("status", ["confirmed", "completed"]),
  ]);

  const totalRevenue =
    revenue.data?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0;

  return {
    totalBookings: bookings.count || 0,
    pendingInquiries: inquiries.count || 0,
    signedContracts: contracts.count || 0,
    totalRevenue,
  };
}

export async function getUpcomingBookings() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("bookings")
    .select("*, clients(name, email)")
    .eq("org_id", userData.orgId)
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(5);

  return data || [];
}

export async function getRecentInquiries() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();

  const { data } = await supabase
    .from("inquiries")
    .select("*, clients(name, email)")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false })
    .limit(5);

  return data || [];
}
