"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getContracts } from "@/actions/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  sent: "default",
  viewed: "secondary",
  signed: "default",
  expired: "destructive",
};

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, [status]);

  async function loadContracts() {
    setLoading(true);
    const data = await getContracts(status);
    setContracts(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contracts</h1>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </Link>
      </div>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="viewed">Viewed</TabsTrigger>
          <TabsTrigger value="signed">Signed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Signed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                    No contracts
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((c) => (
                  <TableRow key={c.id as string}>
                    <TableCell>
                      <Link
                        href={`/dashboard/contracts/${c.id}`}
                        className="font-medium hover:underline"
                      >
                        {(c.clients as Record<string, string>)?.name || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[c.status as string] || "secondary"}>
                        {c.status as string}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {format(new Date(c.created_at as string), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {c.signed_at
                        ? format(new Date(c.signed_at as string), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
