"use client";

import { useState } from "react";
import { sendIntakeForm, emailIntakeFormLink } from "@/actions/intake-forms";
import { updateInquiryStatus } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Send, ClipboardList, Mail, ExternalLink } from "lucide-react";

interface SendDetailsFormProps {
  inquiryId: string;
  clientId: string;
  intakeForms: Record<string, unknown>[];
  resend?: boolean;
}

export function SendDetailsForm({
  inquiryId,
  clientId,
  intakeForms,
  resend = false,
}: SendDetailsFormProps) {
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [emailedTo, setEmailedTo] = useState("");

  async function handleCreate() {
    if (!selectedForm) return;
    setSending(true);

    const result = await sendIntakeForm(selectedForm, inquiryId, clientId);
    if (result.success && result.link) {
      setLink(result.link);
      setSent(true);
      if (!resend) {
        await updateInquiryStatus(inquiryId, "contacted");
      }
    }
    setSending(false);
  }

  async function handleEmail() {
    if (!link || !selectedForm) return;
    setEmailing(true);

    const result = await emailIntakeFormLink(selectedForm, clientId, link);
    if (result.success) {
      setEmailed(true);
      setEmailedTo(result.email || "");
    }
    setEmailing(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (sent && link) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-4 w-4" />
          <p className="text-sm font-medium">Details form link created!</p>
        </div>

        {/* Link with copy + open */}
        <div className="flex items-center gap-2">
          <Input value={link} readOnly className="font-mono text-xs" />
          <Button variant="outline" size="sm" onClick={copyLink} className="shrink-0">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="shrink-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>

        {/* Send via email button */}
        {emailed ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-700">
              Email sent to <strong>{emailedTo}</strong>
            </p>
          </div>
        ) : (
          <Button
            onClick={handleEmail}
            disabled={emailing}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            {emailing ? (
              "Sending email..."
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send Link via Email to Client
              </>
            )}
          </Button>
        )}

        <p className="text-xs text-zinc-400">
          Copy the link to share manually, or send it via email.
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
            onClick={handleCreate}
            disabled={!selectedForm || sending}
            className="btn-gradient text-white border-0"
          >
            {sending ? (
              "Creating..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {resend ? "Create New Form Link" : "Create Details Form Link"}
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
}
