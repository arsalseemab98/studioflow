"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";

export async function getDashboardStats() {
  const userData = await getUser();
  if (!userData?.orgId) return null;

  const supabase = await createClient();
  const orgId = userData.orgId;

  // Use individual queries to avoid RLS issues
  const [bookingsRes, inquiriesRes, contractsRes, revenueRes] = await Promise.all([
    supabase.from("bookings").select("id").eq("org_id", orgId).neq("status", "cancelled"),
    supabase.from("inquiries").select("id").eq("org_id", orgId).eq("status", "new"),
    supabase.from("contracts").select("id").eq("org_id", orgId).eq("status", "signed"),
    supabase.from("bookings").select("total_price").eq("org_id", orgId).in("status", ["confirmed", "completed"]),
  ]);

  const totalRevenue =
    revenueRes.data?.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0) || 0;

  return {
    totalBookings: bookingsRes.data?.length || 0,
    pendingInquiries: inquiriesRes.data?.length || 0,
    signedContracts: contractsRes.data?.length || 0,
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
    .neq("status", "cancelled")
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
