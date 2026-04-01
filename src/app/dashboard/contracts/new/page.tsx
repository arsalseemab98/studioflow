"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients } from "@/actions/clients";
import { createContract } from "@/actions/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Client, ContractBlock } from "@/types/database";

const defaultBlocks: ContractBlock[] = [
  { id: "1", type: "heading", content: "Photography Service Agreement" },
  {
    id: "2",
    type: "paragraph",
    content:
      "This agreement is entered into between the Photographer and the Client for the services described below.",
  },
  { id: "3", type: "field", content: "Event Date", fieldName: "event_date", fieldValue: "" },
  { id: "4", type: "field", content: "Event Location", fieldName: "location", fieldValue: "" },
  { id: "5", type: "field", content: "Package Price", fieldName: "price", fieldValue: "" },
  {
    id: "6",
    type: "paragraph",
    content:
      "The Photographer agrees to provide professional photography services for the duration of the event. A non-refundable retainer of 30% is due upon signing this agreement. The remaining balance is due 14 days before the event date.",
  },
  {
    id: "7",
    type: "paragraph",
    content:
      "The Client grants the Photographer permission to use photographs from the event for portfolio and marketing purposes unless otherwise agreed in writing.",
  },
  { id: "8", type: "signature", content: "Client Signature" },
];

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState(searchParams.get("client") || "");
  const [blocks, setBlocks] = useState<ContractBlock[]>(defaultBlocks);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  async function loadClients() {
    const data = await getClients();
    setClients(data as Client[]);
  }

  function updateBlock(index: number, updates: Partial<ContractBlock>) {
    const updated = [...blocks];
    updated[index] = { ...updated[index], ...updates };
    setBlocks(updated);
  }

  async function handleCreate() {
    if (!selectedClient) return;
    setSaving(true);
    const result = await createContract(
      selectedClient,
      null,
      blocks,
      searchParams.get("inquiry") || undefined
    );
    if (result.success && result.id) {
      router.push(`/dashboard/contracts/${result.id}`);
    }
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Create Contract</h1>

      <div className="space-y-2">
        <Label>Select Client</Label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
        >
          <option value="">Choose a client...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>
      </div>

      {/* Contract Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contract Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {blocks.map((block, index) => (
            <div key={block.id}>
              {block.type === "heading" && (
                <Input
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  className="text-lg font-bold"
                />
              )}
              {block.type === "paragraph" && (
                <Textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  rows={3}
                />
              )}
              {block.type === "field" && (
                <div className="flex gap-3 items-center">
                  <Label className="w-32 text-sm text-zinc-500">
                    {block.content}
                  </Label>
                  <Input
                    value={block.fieldValue || ""}
                    onChange={(e) =>
                      updateBlock(index, { fieldValue: e.target.value })
                    }
                    placeholder={`Enter ${block.content.toLowerCase()}`}
                  />
                </div>
              )}
              {block.type === "signature" && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-zinc-500">
                    {block.content} — (will be signed digitally by client)
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleCreate} disabled={!selectedClient || saving} className="w-full">
        {saving ? "Creating..." : "Create Contract"}
      </Button>
    </div>
  );
}
