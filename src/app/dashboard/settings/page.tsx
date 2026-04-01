"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

export default function SettingsPage() {
  const [org, setOrg] = useState<Record<string, unknown> | null>(null);
  const [members, setMembers] = useState<Record<string, unknown>[]>([]);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    setProfile(p);

    const { data: membership } = await supabase
      .from("org_members")
      .select("*, organizations(*)")
      .eq("user_id", user.id)
      .single();

    if (membership) {
      setOrg(membership.organizations as Record<string, unknown>);
      const { data: m } = await supabase
        .from("org_members")
        .select("*, profiles(full_name, email)")
        .eq("org_id", membership.org_id);
      setMembers(m || []);
    }
  }

  async function saveProfile(formData: FormData) {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        full_name: formData.get("full_name") as string,
        phone: formData.get("phone") as string,
      }).eq("id", user.id);
    }
    setSaving(false);
    loadData();
  }

  async function saveOrg(formData: FormData) {
    setSaving(true);
    const supabase = createClient();
    if (org) {
      await supabase.from("organizations").update({
        name: formData.get("org_name") as string,
      }).eq("id", org.id as string);
    }
    setSaving(false);
    loadData();
  }

  const inquiryLink = org
    ? `${window.location.origin}/inquiry/${org.slug}`
    : "";

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={saveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    name="full_name"
                    defaultValue={(profile?.full_name as string) || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={(profile?.email as string) || ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    name="phone"
                    defaultValue={(profile?.phone as string) || ""}
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={saveOrg} className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input
                    name="org_name"
                    defaultValue={(org?.name as string) || ""}
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Public Inquiry Link</CardTitle>
              <CardDescription>
                Share this link with potential clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value={inquiryLink} readOnly className="font-mono text-xs" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(inquiryLink)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Team Members</CardTitle>
              <CardDescription>
                Manage who has access to your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {members.map((m) => {
                const p = m.profiles as Record<string, string>;
                return (
                  <div
                    key={m.id as string}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {p?.full_name || p?.email || "Unknown"}
                      </p>
                      <p className="text-xs text-zinc-500">{p?.email}</p>
                    </div>
                    <Badge variant="secondary">{m.role as string}</Badge>
                  </div>
                );
              })}
              <div className="border-t pt-4">
                <Label className="text-sm">Invite team member</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="email@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <Button variant="outline" disabled>
                    Invite
                  </Button>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Team invitations coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
