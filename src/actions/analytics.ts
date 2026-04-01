"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/get-user";

export async function getRevenueStats(months: number = 12) {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("event_date, total_price")
    .eq("org_id", userData.orgId)
    .in("status", ["confirmed", "completed"])
    .order("event_date", { ascending: true });

  if (!data) return [];

  // Group by month
  const monthlyRevenue: Record<string, number> = {};
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyRevenue[key] = 0;
  }

  data.forEach((b) => {
    const key = b.event_date.substring(0, 7);
    if (key in monthlyRevenue) {
      monthlyRevenue[key] += b.total_price || 0;
    }
  });

  return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getFunnelStats() {
  const userData = await getUser();
  if (!userData?.orgId) return null;

  const supabase = await createClient();
  const [inq, responses, contracts, bookings] = await Promise.all([
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("org_id", userData.orgId),
    supabase
      .from("intake_responses")
      .select("id, intake_forms!inner(org_id)", { count: "exact", head: true })
      .eq("intake_forms.org_id", userData.orgId)
      .not("submitted_at", "is", null),
    supabase
      .from("contracts")
      .select("id", { count: "exact", head: true })
      .eq("org_id", userData.orgId)
      .eq("status", "signed"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("org_id", userData.orgId)
      .neq("status", "cancelled"),
  ]);

  return {
    inquiries: inq.count || 0,
    intakeForms: responses.count || 0,
    signedContracts: contracts.count || 0,
    bookings: bookings.count || 0,
  };
}

export async function getEventTypeStats() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("event_type, total_price")
    .eq("org_id", userData.orgId)
    .neq("status", "cancelled");

  if (!data) return [];

  const grouped: Record<string, { count: number; revenue: number }> = {};
  data.forEach((b) => {
    const type = b.event_type || "other";
    if (!grouped[type]) grouped[type] = { count: 0, revenue: 0 };
    grouped[type].count++;
    grouped[type].revenue += b.total_price || 0;
  });

  return Object.entries(grouped).map(([type, stats]) => ({
    type,
    count: stats.count,
    revenue: stats.revenue,
  }));
}

export async function getTopClients() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("bookings")
    .select("client_id, total_price, clients(name)")
    .eq("org_id", userData.orgId)
    .in("status", ["confirmed", "completed"]);

  if (!data) return [];

  const grouped: Record<string, { name: string; revenue: number; bookings: number }> = {};
  data.forEach((b) => {
    const cid = b.client_id;
    if (!grouped[cid]) {
      grouped[cid] = {
        name: (b.clients as unknown as Record<string, string>)?.name || "Unknown",
        revenue: 0,
        bookings: 0,
      };
    }
    grouped[cid].revenue += b.total_price || 0;
    grouped[cid].bookings++;
  });

  return Object.values(grouped)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}
