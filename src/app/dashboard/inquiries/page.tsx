"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getInquiries, createManualInquiry } from "@/actions/inquiries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  FileText,
  ClipboardList,
  Circle,
  CheckCircle2,
  Clock,
  Send,
  CalendarCheck,
  Archive,
} from "lucide-react";
import { format } from "date-fns";

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadInquiries();
  }, [status]);

  async function loadInquiries() {
    setLoading(true);
    const data = await getInquiries(status);
    setInquiries(data);
    setLoading(false);
  }

  async function handleCreate(formData: FormData) {
    setCreating(true);
    const result = await createManualInquiry(formData);
    if (result.success) {
      setOpen(false);
      setCreating(false);
      loadInquiries();
    } else {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button type="button" className="btn-gradient text-white border-0">
              <Plus className="h-4 w-4 mr-2" />
              New Inquiry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Inquiry Manually</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Client Name</Label>
                  <Input name="name" required placeholder="John Smith" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input name="email" type="email" placeholder="client@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" placeholder="+1 555-123-4567" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <select
                    name="event_type"
                    required
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="portrait">Portrait</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="birthday">Birthday</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Input name="event_date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input name="location" placeholder="City or venue" />
                </div>
                <div className="space-y-2">
                  <Label>Budget ($)</Label>
                  <Input name="budget" type="number" placeholder="e.g. 2000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="message" rows={3} placeholder="Any details about the event..." />
              </div>
              <Button
                type="submit"
                className="w-full btn-gradient text-white border-0"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Inquiry"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Step</TableHead>
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
                inquiries.map((inq) => {
                  const status = inq.status as string;
                  return (
                  <TableRow key={inq.id as string} className="group">
                    <TableCell>
                      <Link
                        href={`/dashboard/inquiries/${inq.id}`}
                        className="font-medium hover:underline"
                      >
                        {(inq.clients as Record<string, string>)?.name || "Unknown"}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize text-zinc-600">
                      {inq.event_type as string}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">
                      {inq.event_date
                        ? format(new Date(inq.event_date as string), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">
                      {(inq.location as string) || "—"}
                    </TableCell>
                    <TableCell>
                      {status === "new" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600">
                          <Circle className="h-3 w-3 fill-orange-400 text-orange-400" />
                          New
                        </span>
                      ) : status === "contacted" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600">
                          <Clock className="h-3 w-3" />
                          Details Received
                        </span>
                      ) : status === "converted" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Booked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                          <Archive className="h-3 w-3" />
                          Archived
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {status === "new" ? (
                        <Link href={`/dashboard/inquiries/${inq.id}`}>
                          <Button variant="outline" size="sm" className="text-xs border-orange-200 text-orange-600 hover:bg-orange-50">
                            <Send className="h-3 w-3 mr-1" />
                            Send Details Form
                          </Button>
                        </Link>
                      ) : status === "contacted" ? (
                        <Link
                          href={`/dashboard/contracts/new?inquiry=${inq.id}&client=${inq.client_id}&event_type=${inq.event_type}&event_date=${inq.event_date || ""}&location=${inq.location || ""}&budget=${inq.budget || ""}`}
                        >
                          <Button variant="outline" size="sm" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Send Contract
                          </Button>
                        </Link>
                      ) : status === "converted" ? (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                          <CalendarCheck className="h-3 w-3" />
                          Complete
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
