"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";

export async function getDashboardStats() {
  const userData = await getUser();
  if (!userData?.orgId) return null;

  // Use admin client for stats to bypass RLS issues with bookings
  const admin = createAdminClient();
  const orgId = userData.orgId;

  const [bookingsRes, inquiriesRes, contractsRes, revenueRes] = await Promise.all([
    admin.from("bookings").select("id").eq("org_id", orgId).neq("status", "cancelled"),
    admin.from("inquiries").select("id").eq("org_id", orgId).eq("status", "new"),
    admin.from("contracts").select("id").eq("org_id", orgId).eq("status", "signed"),
    admin.from("bookings").select("total_price").eq("org_id", orgId).in("status", ["confirmed", "completed"]),
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

  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data } = await admin
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
