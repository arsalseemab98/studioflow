"use client";

import { useState } from "react";
import { sendIntakeForm } from "@/actions/intake-forms";
import { updateInquiryStatus } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Send, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SendDetailsFormProps {
  inquiryId: string;
  clientId: string;
  intakeForms: Record<string, unknown>[];
}

export function SendDetailsForm({
  inquiryId,
  clientId,
  intakeForms,
}: SendDetailsFormProps) {
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSend() {
    if (!selectedForm) return;
    setSending(true);

    const result = await sendIntakeForm(selectedForm, inquiryId, clientId);
    if (result.success && result.link) {
      setLink(result.link);
      setSent(true);
      // Mark inquiry as contacted (details form sent)
      await updateInquiryStatus(inquiryId, "contacted");
    }
    setSending(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (sent && link) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-4 w-4" />
          <p className="text-sm font-medium">Details form created! Send this link to the client:</p>
        </div>
        <div className="flex items-center gap-2">
          <Input value={link} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="shrink-0">Open</Button>
          </a>
        </div>
        <p className="text-xs text-zinc-400">
          Once the client fills this form, come back here to review their answers and send the contract.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {intakeForms.length === 0 ? (
        <div>
          <p className="text-sm text-zinc-500 mb-2">
            No intake forms yet.{" "}
            <a href="/dashboard/forms" className="text-orange-500 underline">
              Create one first
            </a>
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {intakeForms.map((form) => (
              <button
                key={form.id as string}
                onClick={() => setSelectedForm(form.id as string)}
                className={`text-left p-3 rounded-lg border-2 transition-colors ${
                  selectedForm === form.id
                    ? "border-orange-400 bg-orange-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-zinc-400" />
                  <div>
                    <p className="font-medium text-sm">{form.name as string}</p>
                    <p className="text-xs text-zinc-400">
                      {((form.fields as unknown[]) || []).length} fields
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={handleSend}
            disabled={!selectedForm || sending}
            className="btn-gradient text-white border-0"
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Details Form to Client
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
