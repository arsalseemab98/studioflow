"use client";

import { useEffect, useState } from "react";
import {
  getCrewMembers,
  createCrewMember,
  deleteCrewMember,
  inviteFreelancer,
} from "@/actions/crew";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, UserPlus, Camera, Video } from "lucide-react";
import type { CrewMember } from "@/types/database";

const roleIcons: Record<string, typeof Camera> = {
  photographer: Camera,
  videographer: Video,
};

const roleBadgeColors: Record<string, string> = {
  photographer: "bg-orange-100 text-orange-700",
  videographer: "bg-pink-100 text-pink-700",
  assistant: "bg-blue-100 text-blue-700",
  other: "bg-zinc-100 text-zinc-700",
};

export default function CrewPage() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrew();
  }, []);

  async function loadCrew() {
    setLoading(true);
    const data = await getCrewMembers();
    setCrew(data as CrewMember[]);
    setLoading(false);
  }

  async function handleCreate(formData: FormData) {
    const result = await createCrewMember(formData);
    if (result.success) {
      setOpen(false);
      loadCrew();
    }
  }

  async function handleDelete(id: string) {
    await deleteCrewMember(id);
    loadCrew();
  }

  async function handleInvite(member: CrewMember) {
    if (!member.email) return;
    const result = await inviteFreelancer(member.id, member.email);
    if (result.success) {
      loadCrew();
    }
  }

  const teamMembers = crew.filter((c) => c.type === "team");
  const externalCrew = crew.filter((c) => c.type === "external");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crew</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              Add Crew Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Crew Member</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input name="name" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input name="phone" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Role</Label>
                  <select
                    name="role"
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="photographer">Photographer</option>
                    <option value="videographer">Videographer</option>
                    <option value="assistant">Assistant</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <select
                    name="type"
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="team">Team Member</option>
                    <option value="external">External Freelancer</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" rows={2} />
              </div>
              <Button type="submit" className="w-full btn-gradient text-white border-0">
                Add Crew Member
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Members</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">Loading...</TableCell>
                </TableRow>
              ) : teamMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No team members yet</TableCell>
                </TableRow>
              ) : (
                teamMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[m.role]}`}>
                        {m.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500">{m.email || "—"}</TableCell>
                    <TableCell className="text-zinc-500">{m.phone || "—"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* External Freelancers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">External Freelancers</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Portal Access</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {externalCrew.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-zinc-500">No freelancers yet</TableCell>
                </TableRow>
              ) : (
                externalCrew.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleBadgeColors[m.role]}`}>
                        {m.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500">{m.email || "—"}</TableCell>
                    <TableCell>
                      {m.user_id ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
                      ) : m.email ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleInvite(m)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Invite
                        </Button>
                      ) : (
                        <span className="text-xs text-zinc-400">No email</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(m.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
