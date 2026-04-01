"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getContractByToken, signContract } from "@/actions/contracts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SignaturePad } from "@/components/contracts/signature-pad";
import { CheckCircle } from "lucide-react";
import type { ContractBlock } from "@/types/database";

export default function PublicContractPage() {
  const { token } = useParams<{ token: string }>();
  const [contract, setContract] = useState<Record<string, unknown> | null>(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContract();
  }, [token]);

  async function loadContract() {
    const data = await getContractByToken(token);
    if (data) {
      setContract(data);
      if (data.status === "signed") setSigned(true);
    }
    setLoading(false);
  }

  async function handleSign(signatureData: string) {
    const result = await signContract(token, signatureData);
    if (result.success) setSigned(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Contract not found</p>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Contract Signed!</h2>
            <p className="text-zinc-500 text-sm">
              Thank you for signing. You&apos;ll receive a confirmation email shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const blocks = contract.content as ContractBlock[];
  const client = contract.clients as Record<string, string>;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Agreement</CardTitle>
            <CardDescription>
              Please review and sign this contract, {client?.name}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.map((block) => (
              <div key={block.id}>
                {block.type === "heading" && (
                  <h2 className="text-xl font-bold">{block.content}</h2>
                )}
                {block.type === "paragraph" && (
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    {block.content}
                  </p>
                )}
                {block.type === "field" && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-zinc-500">{block.content}:</span>
                    <span className="font-medium">
                      {block.fieldValue || "—"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Signature</CardTitle>
            <CardDescription>
              Draw your signature below to sign this contract.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignaturePad onSign={handleSign} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
