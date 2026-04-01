"use client";

import { useState } from "react";
import { assignCrew, unassignCrew } from "@/actions/crew";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, UserPlus, X, Plus } from "lucide-react";

interface BookingCrewPanelProps {
  bookingId: string;
  assignments: Record<string, unknown>[];
  crew: Record<string, unknown>[];
}

const roleIcons: Record<string, typeof Camera> = {
  photographer: Camera,
  videographer: Video,
};

const roleBadgeColors: Record<string, string> = {
  photographer: "bg-orange-100 text-orange-700 border-orange-200",
  videographer: "bg-pink-100 text-pink-700 border-pink-200",
  assistant: "bg-blue-100 text-blue-700 border-blue-200",
  other: "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function BookingCrewPanel({
  bookingId,
  assignments: initialAssignments,
  crew,
}: BookingCrewPanelProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const assignedIds = assignments.map(
    (a) => (a.crew_members as Record<string, unknown>)?.id || a.crew_member_id
  );
  const availableCrew = crew.filter((c) => !assignedIds.includes(c.id));

  async function handleAssign(crewMemberId: string, role: string) {
    setAdding(true);
    const result = await assignCrew(bookingId, crewMemberId, role);
    if (result.success) {
      const member = crew.find((c) => c.id === crewMemberId);
      setAssignments([
        ...assignments,
        {
          id: Date.now().toString(),
          crew_member_id: crewMemberId,
          role,
          crew_members: member,
        },
      ]);
    }
    setAdding(false);
    setShowAdd(false);
  }

  async function handleUnassign(assignmentId: string) {
    await unassignCrew(assignmentId);
    setAssignments(assignments.filter((a) => a.id !== assignmentId));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Assigned Crew
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Assign
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.length === 0 && !showAdd ? (
          <p className="text-sm text-zinc-400">No crew assigned yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {assignments.map((a) => {
              const member = a.crew_members as Record<string, unknown>;
              const role = (a.role || member?.role || "other") as string;
              const Icon = roleIcons[role] || UserPlus;
              return (
                <Badge
                  key={a.id as string}
                  variant="outline"
                  className={`flex items-center gap-1.5 px-3 py-2 ${roleBadgeColors[role] || ""}`}
                >
                  <Icon className="h-3 w-3" />
                  <span className="font-medium">
                    {(member?.name as string) || "Unknown"}
                  </span>
                  <span className="text-xs opacity-60 capitalize">{role}</span>
                  <button onClick={() => handleUnassign(a.id as string)}>
                    <X className="h-3 w-3 ml-1 hover:text-red-500" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}

        {showAdd && (
          <div className="border-t pt-3 mt-3 space-y-2">
            <p className="text-xs font-medium text-zinc-500">Available crew:</p>
            {availableCrew.length === 0 ? (
              <p className="text-xs text-zinc-400">
                All crew members are assigned.{" "}
                <a href="/dashboard/crew" className="text-orange-500 underline">
                  Add more
                </a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableCrew.map((c) => (
                  <Button
                    key={c.id as string}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={adding}
                    onClick={() =>
                      handleAssign(c.id as string, c.role as string)
                    }
                  >
                    {c.role === "photographer" ? (
                      <Camera className="h-3 w-3 mr-1" />
                    ) : (
                      <Video className="h-3 w-3 mr-1" />
                    )}
                    {c.name as string}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
