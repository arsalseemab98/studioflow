"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients } from "@/actions/clients";
import { createContract, getContractTemplates } from "@/actions/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";
import type { Client, ContractBlock, ContractTemplate } from "@/types/database";

export default function NewContractPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [useTemplate, setUseTemplate] = useState(false);
  const [templateBlocks, setTemplateBlocks] = useState<ContractBlock[]>([]);
  const [selectedClient, setSelectedClient] = useState(
    searchParams.get("client") || ""
  );
  const [saving, setSaving] = useState(false);

  // Pre-fill from inquiry params
  const eventType = searchParams.get("event_type") || "";
  const eventDate = searchParams.get("event_date") || "";
  const location = searchParams.get("location") || "";
  const budgetHint = searchParams.get("budget") || "";
  const inquiryId = searchParams.get("inquiry") || "";

  const [price, setPrice] = useState(budgetHint);
  const [eventDateValue, setEventDateValue] = useState(eventDate);
  const [locationValue, setLocationValue] = useState(location);
  const [terms, setTerms] = useState(
    "The Photographer agrees to provide professional photography and/or videography services for the duration of the event. A non-refundable retainer of 30% is due upon signing this agreement. The remaining balance is due 14 days before the event date.\n\nThe Client grants the Photographer permission to use photographs from the event for portfolio and marketing purposes unless otherwise agreed in writing.\n\nCancellation more than 30 days before the event: full refund minus retainer. Cancellation within 30 days: no refund."
  );

  useEffect(() => {
    loadClients();
    loadTemplates();
  }, []);

  async function loadClients() {
    const data = await getClients();
    setClients(data as Client[]);
  }

  async function loadTemplates() {
    const data = await getContractTemplates();
    setTemplates(data as ContractTemplate[]);
  }

  function selectTemplate(templateId: string) {
    setSelectedTemplate(templateId);
    const tmpl = templates.find((t) => t.id === templateId);
    if (tmpl) {
      setUseTemplate(true);
      // Pre-fill field values from inquiry params
      const blocks = (tmpl.content as ContractBlock[]).map((block) => {
        if (block.type === "field") {
          if (block.fieldName === "client_name") {
            const c = clients.find((cl) => cl.id === selectedClient);
            return { ...block, fieldValue: c?.name || "" };
          }
          if (block.fieldName === "client_email") {
            const c = clients.find((cl) => cl.id === selectedClient);
            return { ...block, fieldValue: c?.email || "" };
          }
          if (block.fieldName === "client_contact") {
            const c = clients.find((cl) => cl.id === selectedClient);
            return { ...block, fieldValue: c?.phone || "" };
          }
          if (block.fieldName === "event_date") return { ...block, fieldValue: eventDate };
          if (block.fieldName === "location") return { ...block, fieldValue: location };
          if (block.fieldName === "price") return { ...block, fieldValue: price ? `$${Number(price).toLocaleString()}` : "" };
        }
        return block;
      });
      setTemplateBlocks(blocks);
    }
  }

  function updateTemplateField(blockId: string, value: string) {
    setTemplateBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, fieldValue: value } : b))
    );
  }

  async function handleCreate() {
    if (!selectedClient || !price) return;
    setSaving(true);

    // Use template blocks if selected, otherwise build simple contract
    if (useTemplate && templateBlocks.length > 0) {
      // Update price field in template
      const finalBlocks = templateBlocks.map((b) => {
        if (b.type === "field" && b.fieldName === "price" && !b.fieldValue) {
          return { ...b, fieldValue: `$${Number(price).toLocaleString()}` };
        }
        return b;
      });
      const result = await createContract(
        selectedClient,
        selectedTemplate || null,
        finalBlocks,
        inquiryId || undefined
      );
      if (result.success && result.id) {
        router.push(`/dashboard/contracts/${result.id}`);
      }
      setSaving(false);
      return;
    }

    const blocks: ContractBlock[] = [
      {
        id: "1",
        type: "heading",
        content: `${eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) + " " : ""}Photography Service Agreement`,
      },
      {
        id: "2",
        type: "paragraph",
        content:
          "This agreement is entered into between the Photographer/Studio and the Client for the services described below.",
      },
      {
        id: "3",
        type: "field",
        content: "Event Date",
        fieldName: "event_date",
        fieldValue: eventDateValue,
      },
      {
        id: "4",
        type: "field",
        content: "Event Location",
        fieldName: "location",
        fieldValue: locationValue,
      },
      {
        id: "5",
        type: "field",
        content: "Total Price",
        fieldName: "price",
        fieldValue: `$${Number(price).toLocaleString()}`,
      },
      {
        id: "6",
        type: "paragraph",
        content: terms,
      },
      { id: "7", type: "signature", content: "Client Signature" },
    ];

    const result = await createContract(
      selectedClient,
      null,
      blocks,
      inquiryId || undefined
    );
    if (result.success && result.id) {
      router.push(`/dashboard/contracts/${result.id}`);
    }
    setSaving(false);
  }

  const selectedClientData = clients.find((c) => c.id === selectedClient);

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Create Contract</h1>

      {/* Template Selection */}
      {templates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Choose Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => { setUseTemplate(false); setSelectedTemplate(""); }}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${
                  !useTemplate ? "border-orange-400 bg-orange-50" : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <p className="font-medium text-sm">Simple Contract</p>
                <p className="text-xs text-zinc-500 mt-1">Basic agreement with custom terms</p>
              </button>
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t.id)}
                  className={`text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedTemplate === t.id ? "border-orange-400 bg-orange-50" : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-1 capitalize">{t.category} &middot; {((t.content as unknown[]) || []).length} sections</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {inquiryId && (
        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
          Pre-filled from inquiry
        </Badge>
      )}

      {/* Client Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Event Date</Label>
              <Input
                type="date"
                value={eventDateValue}
                onChange={(e) => setEventDateValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                placeholder="Venue name or address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Price */}
      <Card className="border-orange-200 bg-orange-50/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-orange-500" />
            Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-zinc-400">$</span>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter total price"
              className="text-2xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 max-w-[200px]"
            />
          </div>
          {budgetHint && (
            <p className="text-xs text-orange-600 mt-2">
              Client&apos;s budget hint: ${Number(budgetHint).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Template fields or custom terms */}
      {useTemplate && templateBlocks.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contract Fields</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {templateBlocks
              .filter((b) => b.type === "field")
              .map((block) => (
                <div key={block.id} className="flex items-center gap-3">
                  <Label className="w-36 text-sm text-zinc-500 shrink-0">
                    {block.content}
                  </Label>
                  <Input
                    value={block.fieldValue || ""}
                    onChange={(e) => updateTemplateField(block.id, e.target.value)}
                    placeholder={`Enter ${block.content?.toLowerCase()}`}
                  />
                </div>
              ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contract Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              rows={8}
              className="text-sm"
            />
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <h3 className="text-lg font-bold">
            {eventType
              ? `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Photography Service Agreement`
              : "Photography Service Agreement"}
          </h3>
          <p className="text-zinc-500">
            Client: <strong>{selectedClientData?.name || "—"}</strong>
          </p>
          <div className="grid grid-cols-3 gap-4 text-zinc-600">
            <div>
              Date: <strong>{eventDateValue || "—"}</strong>
            </div>
            <div>
              Location: <strong>{locationValue || "—"}</strong>
            </div>
            <div>
              Price:{" "}
              <strong className="text-orange-600">
                ${price ? Number(price).toLocaleString() : "—"}
              </strong>
            </div>
          </div>
          <p className="text-zinc-500 whitespace-pre-wrap leading-relaxed">
            {terms}
          </p>
          <div className="border-t pt-4 text-zinc-400 italic">
            Client Signature — (will be signed digitally)
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleCreate}
        disabled={!selectedClient || !price || saving}
        className="w-full btn-gradient text-white border-0 py-6 text-base"
      >
        {saving ? "Creating..." : "Create & Send Contract"}
      </Button>
    </div>
  );
}
