import { getInquiry, updateInquiryStatus } from "@/actions/inquiries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiry(id);

  if (!inquiry) notFound();

  const client = inquiry.clients as Record<string, string> | null;

  async function markContacted() {
    "use server";
    await updateInquiryStatus(id, "contacted");
  }

  async function markConverted() {
    "use server";
    await updateInquiryStatus(id, "converted");
  }

  async function markArchived() {
    "use server";
    await updateInquiryStatus(id, "archived");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {client?.name || "Unknown Client"}
          </h1>
          <p className="text-zinc-500 text-sm">
            {inquiry.event_type} &middot;{" "}
            {format(new Date(inquiry.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <Badge variant={inquiry.status === "new" ? "default" : "secondary"}>
          {inquiry.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Event Type</p>
            <p className="font-medium capitalize">{inquiry.event_type}</p>
          </div>
          <div>
            <p className="text-zinc-500">Event Date</p>
            <p className="font-medium">
              {inquiry.event_date
                ? format(new Date(inquiry.event_date), "MMMM d, yyyy")
                : "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Location</p>
            <p className="font-medium">{inquiry.location || "Not specified"}</p>
          </div>
          <div>
            <p className="text-zinc-500">Budget</p>
            <p className="font-medium">
              {inquiry.budget ? `$${Number(inquiry.budget).toLocaleString()}` : "Not specified"}
            </p>
          </div>
        </CardContent>
      </Card>

      {inquiry.message && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Email</p>
            <p className="font-medium">{client?.email || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500">Phone</p>
            <p className="font-medium">{client?.phone || "—"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {inquiry.status === "new" && (
            <form action={markContacted}>
              <Button variant="outline" type="submit">
                Mark Contacted
              </Button>
            </form>
          )}
          {(inquiry.status === "new" || inquiry.status === "contacted") && (
            <>
              <Link href={`/dashboard/contracts/new?inquiry=${id}&client=${inquiry.client_id}`}>
                <Button>Send Contract</Button>
              </Link>
              <form action={markConverted}>
                <Button variant="outline" type="submit">
                  Mark Converted
                </Button>
              </form>
            </>
          )}
          {inquiry.status !== "archived" && (
            <form action={markArchived}>
              <Button variant="destructive" type="submit">
                Archive
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
