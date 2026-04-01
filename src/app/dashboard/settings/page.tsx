"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Building2, Globe, Mail, Phone, MapPin, Palette } from "lucide-react";

export default function SettingsPage() {
  const [org, setOrg] = useState<Record<string, unknown> | null>(null);
  const [members, setMembers] = useState<Record<string, unknown>[]>([]);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({
          full_name: formData.get("full_name") as string,
          phone: formData.get("phone") as string,
        })
        .eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadData();
  }

  async function saveOrg(formData: FormData) {
    setSaving(true);
    const supabase = createClient();
    if (org) {
      await supabase
        .from("organizations")
        .update({
          name: formData.get("org_name") as string,
          description: formData.get("description") as string,
          website: formData.get("website") as string,
          email: formData.get("org_email") as string,
          phone: formData.get("org_phone") as string,
          address: formData.get("address") as string,
          industry: formData.get("industry") as string,
          primary_color: formData.get("primary_color") as string,
        })
        .eq("id", org.id as string);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    loadData();
  }

  const inquiryLink = org
    ? `${window.location.origin}/inquiry/${org.slug}`
    : "";

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="links">Public Links</TabsTrigger>
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Company Information
              </CardTitle>
              <CardDescription>
                This info appears on your public forms and contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={saveOrg} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      name="org_name"
                      defaultValue={(org?.name as string) || ""}
                      placeholder="Your Studio Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <select
                      name="industry"
                      defaultValue={(org?.industry as string) || "photography"}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                    >
                      <option value="photography">Photography</option>
                      <option value="videography">Videography</option>
                      <option value="wedding_planning">Wedding Planning</option>
                      <option value="event_planning">Event Planning</option>
                      <option value="photo_video">Photo & Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    name="description"
                    defaultValue={(org?.description as string) || ""}
                    placeholder="Tell clients about your studio..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" /> Website
                    </Label>
                    <Input
                      name="website"
                      defaultValue={(org?.website as string) || ""}
                      placeholder="https://yourstudio.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> Business Email
                    </Label>
                    <Input
                      name="org_email"
                      type="email"
                      defaultValue={(org?.email as string) || ""}
                      placeholder="hello@yourstudio.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Business Phone
                    </Label>
                    <Input
                      name="org_phone"
                      defaultValue={(org?.phone as string) || ""}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Address
                    </Label>
                    <Input
                      name="address"
                      defaultValue={(org?.address as string) || ""}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Palette className="h-3.5 w-3.5" /> Brand Color
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="primary_color"
                      defaultValue={(org?.primary_color as string) || "#f97316"}
                      className="w-10 h-10 rounded-lg border border-zinc-200 cursor-pointer"
                    />
                    <p className="text-xs text-zinc-400">
                      Used on your public forms and client-facing pages
                    </p>
                  </div>
                </div>

                <Button type="submit" disabled={saving} className="btn-gradient text-white border-0">
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Company Info"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile */}
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

        {/* Team */}
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
                    <Badge
                      variant="secondary"
                      className={
                        m.role === "freelancer"
                          ? "bg-purple-100 text-purple-700"
                          : ""
                      }
                    >
                      {m.role as string}
                    </Badge>
                  </div>
                );
              })}
              <div className="border-t pt-4">
                <p className="text-xs text-zinc-400">
                  To add team members, go to{" "}
                  <a href="/dashboard/crew" className="text-orange-500 underline">
                    Crew Management
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Public Links */}
        <TabsContent value="links" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Public Inquiry Form</CardTitle>
              <CardDescription>
                Share this link so clients can submit inquiries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={inquiryLink}
                  readOnly
                  className="font-mono text-xs"
                />
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Company Slug</CardTitle>
              <CardDescription>
                This is your unique URL identifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-zinc-100 px-3 py-1.5 rounded font-mono">
                  {(org?.slug as string) || "—"}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
