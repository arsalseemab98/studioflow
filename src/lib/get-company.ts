import { createAdminClient } from "@/lib/supabase/admin";
import type { CompanyInfo } from "@/lib/email";

export async function getCompanyInfo(orgId: string): Promise<CompanyInfo> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("organizations")
    .select("name, email, phone, website, address, primary_color")
    .eq("id", orgId)
    .single();

  return {
    name: data?.name || "Studio",
    email: data?.email,
    phone: data?.phone,
    website: data?.website,
    address: data?.address,
    primary_color: data?.primary_color,
  };
}
