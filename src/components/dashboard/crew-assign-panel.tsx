"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Video, UserPlus, X } from "lucide-react";
import type { CrewMember } from "@/types/database";

interface CrewAssignPanelProps {
  inquiryId: string;
  crew: Record<string, unknown>[];
}

export function CrewAssignPanel({ inquiryId, crew }: CrewAssignPanelProps) {
  const [assigned, setAssigned] = useState<
    { id: string; name: string; role: string }[]
  >([]);

  const photographers = crew.filter((c) => c.role === "photographer");
  const videographers = crew.filter((c) => c.role === "videographer");

  function assign(member: Record<string, unknown>) {
    if (assigned.find((a) => a.id === member.id)) return;
    setAssigned([
      ...assigned,
      {
        id: member.id as string,
        name: member.name as string,
        role: member.role as string,
      },
    ]);
  }

  function unassign(id: string) {
    setAssigned(assigned.filter((a) => a.id !== id));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Assign Crew
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assigned */}
        {assigned.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {assigned.map((a) => (
              <Badge
                key={a.id}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5"
              >
                {a.role === "photographer" ? (
                  <Camera className="h-3 w-3" />
                ) : (
                  <Video className="h-3 w-3" />
                )}
                {a.name}
                <button onClick={() => unassign(a.id)}>
                  <X className="h-3 w-3 ml-1 hover:text-red-500" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Photographer picker */}
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5" /> Photographers
          </p>
          <div className="flex flex-wrap gap-2">
            {photographers.length === 0 ? (
              <p className="text-xs text-zinc-400">
                No photographers in crew.{" "}
                <a
                  href="/dashboard/crew"
                  className="text-orange-500 underline"
                >
                  Add one
                </a>
              </p>
            ) : (
              photographers.map((p) => (
                <Button
                  key={p.id as string}
                  variant="outline"
                  size="sm"
                  onClick={() => assign(p)}
                  disabled={!!assigned.find((a) => a.id === p.id)}
                  className="text-xs"
                >
                  {p.name as string}
                  {p.type === "external" && (
                    <span className="ml-1 text-zinc-400">(freelancer)</span>
                  )}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Videographer picker */}
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-2 flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5" /> Videographers
          </p>
          <div className="flex flex-wrap gap-2">
            {videographers.length === 0 ? (
              <p className="text-xs text-zinc-400">
                No videographers in crew.{" "}
                <a
                  href="/dashboard/crew"
                  className="text-orange-500 underline"
                >
                  Add one
                </a>
              </p>
            ) : (
              videographers.map((v) => (
                <Button
                  key={v.id as string}
                  variant="outline"
                  size="sm"
                  onClick={() => assign(v)}
                  disabled={!!assigned.find((a) => a.id === v.id)}
                  className="text-xs"
                >
                  {v.name as string}
                  {v.type === "external" && (
                    <span className="ml-1 text-zinc-400">(freelancer)</span>
                  )}
                </Button>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
