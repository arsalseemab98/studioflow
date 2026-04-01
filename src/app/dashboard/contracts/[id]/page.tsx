import { getContract, sendContract } from "@/actions/contracts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ContractBlock } from "@/types/database";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = await getContract(id);

  if (!contract) notFound();

  const client = contract.clients as Record<string, string> | null;
  const blocks = contract.content as ContractBlock[];
  const signingLink = `${process.env.NEXT_PUBLIC_APP_URL}/contract/${contract.access_token}`;

  async function handleSend() {
    "use server";
    await sendContract(id);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contract</h1>
          <p className="text-zinc-500 text-sm">
            For {client?.name || "Unknown"} &middot;{" "}
            {format(new Date(contract.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <Badge
          variant={
            contract.status === "signed"
              ? "default"
              : contract.status === "draft"
              ? "outline"
              : "secondary"
          }
        >
          {contract.status}
        </Badge>
      </div>

      {/* Contract Preview */}
      <Card>
        <CardContent className="pt-6 space-y-4">
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
                  <span className="font-medium">{block.fieldValue || "—"}</span>
                </div>
              )}
              {block.type === "signature" && (
                <div className="border-t pt-4 mt-4">
                  {contract.signature_data ? (
                    <div>
                      <p className="text-xs text-zinc-500 mb-2">
                        Signed on{" "}
                        {contract.signed_at &&
                          format(new Date(contract.signed_at), "MMMM d, yyyy 'at' h:mm a")}
                      </p>
                      <img
                        src={contract.signature_data}
                        alt="Signature"
                        className="h-20 border rounded"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400 italic">
                      Awaiting signature...
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {contract.status === "draft" && (
            <form action={handleSend}>
              <Button type="submit">Send to Client</Button>
            </form>
          )}
          {(contract.status === "sent" || contract.status === "viewed") && (
            <div>
              <p className="text-sm text-zinc-500 mb-2">Signing link:</p>
              <code className="text-xs bg-zinc-100 dark:bg-zinc-800 p-2 rounded block break-all">
                {signingLink}
              </code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
