"use client";

import { useState } from "react";
import { sendIntakeForm, emailIntakeFormLink } from "@/actions/intake-forms";
import { updateInquiryStatus } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Send, ClipboardList, Mail, ExternalLink, CheckCircle2 } from "lucide-react";

interface SendDetailsFormProps {
  inquiryId: string;
  clientId: string;
  intakeForms: Record<string, unknown>[];
  resend?: boolean;
  existingLink?: { link: string; formId: string; submitted: boolean } | null;
}

export function SendDetailsForm({
  inquiryId,
  clientId,
  intakeForms,
  resend = false,
  existingLink = null,
}: SendDetailsFormProps) {
  const [selectedForm, setSelectedForm] = useState<string>(existingLink?.formId || "");
  const [link, setLink] = useState<string>(existingLink?.link || "");
  const [sending, setSending] = useState(false);
  const [hasLink, setHasLink] = useState(!!existingLink?.link);
  const [copied, setCopied] = useState(false);
  const [emailing, setEmailing] = useState(false);
  const [emailed, setEmailed] = useState(false);
  const [emailedTo, setEmailedTo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(existingLink?.submitted || false);

  async function handleCreate() {
    if (!selectedForm) return;
    setSending(true);

    const result = await sendIntakeForm(selectedForm, inquiryId, clientId);
    if (result.success && result.link) {
      setLink(result.link);
      setHasLink(true);
      setIsSubmitted(false);
      setEmailed(false);
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

  // Show existing or just-created link
  if (hasLink && link) {
    return (
      <div className="space-y-4">
        {/* Status */}
        {isSubmitted ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-sm text-green-700 font-medium">Client has filled out this form</p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-orange-50 text-orange-600 border-orange-200">
              Waiting for client to fill
            </Badge>
          </div>
        )}

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

        {/* Send via email */}
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

        {/* Create new link option */}
        <button
          onClick={() => { setHasLink(false); setLink(""); setEmailed(false); }}
          className="text-xs text-zinc-400 hover:text-zinc-600 underline"
        >
          Create a new form link instead
        </button>
      </div>
    );
  }

  // Form picker + create button
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
