"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink } from "lucide-react";

export function CopySigningLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <p className="text-sm text-zinc-500 mb-2">Signing link:</p>
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
    </div>
  );
}
