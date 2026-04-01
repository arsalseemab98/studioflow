"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Send, Link2, Mail } from "lucide-react";

interface ShareInquiryLinkProps {
  slug: string;
}

export function ShareInquiryLink({ slug }: ShareInquiryLinkProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [sent, setSent] = useState(false);

  if (!slug) return null;

  const link = `${window.location.origin}/inquiry/${slug}`;

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function sendViaEmail() {
    if (!email) return;
    // Open default email client with pre-filled content
    const subject = encodeURIComponent("We'd love to hear about your event!");
    const body = encodeURIComponent(
      `Hi,\n\nThank you for your interest! Please fill out our inquiry form so we can learn more about your event:\n\n${link}\n\nWe'll get back to you shortly.\n\nBest regards`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail("");
      setShowEmail(false);
    }, 3000);
  }

  return (
    <Card className="border-orange-100 bg-gradient-to-r from-orange-50/50 to-pink-50/50">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center text-white shrink-0">
              <Link2 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Share Inquiry Form</p>
              <p className="text-xs text-zinc-500">
                Send this link to potential clients to collect event details
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-zinc-200 rounded-lg overflow-hidden">
              <code className="text-xs px-3 py-2 text-zinc-600 max-w-[250px] truncate">
                {link}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyLink}
                className="rounded-none border-l h-full px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmail(!showEmail)}
              className="shrink-0"
            >
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
        </div>

        {showEmail && (
          <div className="mt-4 flex items-center gap-2 pt-4 border-t border-orange-100">
            <Input
              type="email"
              placeholder="client@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-xs bg-white"
              onKeyDown={(e) => e.key === "Enter" && sendViaEmail()}
            />
            <Button
              onClick={sendViaEmail}
              disabled={!email || sent}
              className="btn-gradient text-white border-0 shrink-0"
              size="sm"
            >
              {sent ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Opened
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-1" />
                  Send Link
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
