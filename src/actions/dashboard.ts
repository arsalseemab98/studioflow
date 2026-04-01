"use server";

import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Get org_id
  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) return null;
  const orgId = membership.org_id;

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
    revenue.data?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0;

  return {
    totalBookings: bookings.count || 0,
    pendingInquiries: inquiries.count || 0,
    signedContracts: contracts.count || 0,
    totalRevenue,
  };
}

export async function getUpcomingBookings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("bookings")
    .select("*, clients(name, email)")
    .eq("org_id", membership.org_id)
    .gte("event_date", today)
    .neq("status", "cancelled")
    .order("event_date", { ascending: true })
    .limit(5);

  return data || [];
}

export async function getRecentInquiries() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) return [];

  const { data } = await supabase
    .from("inquiries")
    .select("*, clients(name, email)")
    .eq("org_id", membership.org_id)
    .order("created_at", { ascending: false })
    .limit(5);

  return data || [];
}
