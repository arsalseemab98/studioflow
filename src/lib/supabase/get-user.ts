import { createClient } from "./server";
import type { Organization, Profile } from "@/types/database";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: membership } = await supabase
    .from("org_members")
    .select("*, organizations(*)")
    .eq("user_id", user.id)
    .single();

  return {
    user,
    profile: profile as Profile | null,
    organization: membership?.organizations as Organization | null,
    orgId: membership?.org_id as string | null,
    role: membership?.role as "owner" | "admin" | "member" | null,
  };
}
