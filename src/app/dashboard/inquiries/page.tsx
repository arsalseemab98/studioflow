"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInquiries } from "@/actions/inquiries";
import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  converted: "outline",
  archived: "destructive",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInquiries();
  }, [status]);

  async function loadInquiries() {
    setLoading(true);
    const data = await getInquiries(status);
    setInquiries(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inquiries</h1>

      <Tabs value={status} onValueChange={setStatus}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : inquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    No inquiries
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inq) => (
                  <TableRow key={inq.id as string}>
                    <TableCell>
                      <Link
                        href={`/dashboard/inquiries/${inq.id}`}
                        className="font-medium hover:underline"
                      >
                        {(inq.clients as Record<string, string>)?.name || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">
                      {inq.event_type as string}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {inq.event_date
                        ? format(new Date(inq.event_date as string), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {(inq.location as string) || "—"}
                    </TableCell>
                    <TableCell className="text-zinc-500">
                      {inq.budget ? `$${Number(inq.budget).toLocaleString()}` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[inq.status as string] || "secondary"}>
                        {inq.status as string}
                      </Badge>
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
