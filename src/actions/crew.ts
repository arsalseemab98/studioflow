"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUser } from "@/lib/supabase/get-user";
import { revalidatePath } from "next/cache";

export async function getCrewMembers() {
  const userData = await getUser();
  if (!userData?.orgId) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("crew_members")
    .select("*")
    .eq("org_id", userData.orgId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function createCrewMember(formData: FormData) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const type = formData.get("type") as string;

  const { error } = await supabase.from("crew_members").insert({
    org_id: userData.orgId,
    name: formData.get("name") as string,
    email,
    phone: formData.get("phone") as string,
    role: formData.get("role") as string,
    type,
    notes: formData.get("notes") as string,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/crew");
  return { success: true };
}

export async function updateCrewMember(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("crew_members")
    .update({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      type: formData.get("type") as string,
      notes: formData.get("notes") as string,
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/crew");
  return { success: true };
}

export async function deleteCrewMember(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("crew_members").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/crew");
  return { success: true };
}

export async function inviteFreelancer(crewMemberId: string, email: string) {
  const userData = await getUser();
  if (!userData?.orgId) return { error: "Not authenticated" };

  const admin = createAdminClient();

  // Create user account for freelancer
  const { data: newUser, error: authError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    password: Math.random().toString(36).slice(-12) + "A1!",
    user_metadata: { full_name: email.split("@")[0], invited_as: "freelancer" },
  });

  if (authError) return { error: authError.message };
  if (!newUser.user) return { error: "Failed to create user" };

  // Add as freelancer to org
  await admin.from("org_members").insert({
    org_id: userData.orgId,
    user_id: newUser.user.id,
    role: "freelancer",
  });

  // Link crew member to user
  await admin
    .from("crew_members")
    .update({ user_id: newUser.user.id })
    .eq("id", crewMemberId);

  revalidatePath("/dashboard/crew");
  return { success: true };
}

// Booking assignments
export async function getBookingAssignments(bookingId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_assignments")
    .select("*, crew_members(*)")
    .eq("booking_id", bookingId);
  return data || [];
}

export async function assignCrew(bookingId: string, crewMemberId: string, role: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("booking_assignments").insert({
    booking_id: bookingId,
    crew_member_id: crewMemberId,
    role,
  });

  if (error) return { error: error.message };
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  return { success: true };
}

export async function unassignCrew(assignmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("booking_assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) return { error: error.message };
  return { success: true };
}

// For freelancer portal
export async function getFreelancerBookings() {
  const userData = await getUser();
  if (!userData?.user) return [];

  const supabase = await createClient();

  // Get crew member ID for this user
  const { data: crewMember } = await supabase
    .from("crew_members")
    .select("id")
    .eq("user_id", userData.user.id)
    .single();

  if (!crewMember) return [];

  const { data } = await supabase
    .from("booking_assignments")
    .select("*, bookings(*, clients(name)), crew_members(*)")
    .eq("crew_member_id", crewMember.id)
    .order("created_at", { ascending: false });

  return data || [];
}
