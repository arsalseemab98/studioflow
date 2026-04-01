import { getInquiry, updateInquiryStatus } from "@/actions/inquiries";
import { getCrewMembers } from "@/actions/crew";
import { getIntakeForms, sendIntakeForm } from "@/actions/intake-forms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ClipboardList, FileText, Users } from "lucide-react";
import { CrewAssignPanel } from "@/components/dashboard/crew-assign-panel";
import { SendDetailsForm } from "@/components/dashboard/send-details-form";

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [inquiry, crew, intakeForms] = await Promise.all([
    getInquiry(id),
    getCrewMembers(),
    getIntakeForms(),
  ]);

  if (!inquiry) notFound();

  const client = inquiry.clients as Record<string, string> | null;

  const pipelineSteps = [
    { key: "submitted", label: "Inquiry", done: true },
    {
      key: "details",
      label: "Details Form",
      done: ["contacted", "converted", "archived"].includes(inquiry.status),
    },
    {
      key: "crew",
      label: "Crew Assigned",
      done: ["contacted", "converted"].includes(inquiry.status),
    },
    {
      key: "contract",
      label: "Contract Sent",
      done: inquiry.status === "converted",
    },
    {
      key: "booked",
      label: "Booked",
      done: inquiry.status === "converted",
    },
  ];

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
    <div className="space-y-6 max-w-4xl">
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
        <Badge
          variant={inquiry.status === "new" ? "default" : "secondary"}
          className={
            inquiry.status === "new"
              ? "btn-gradient text-white border-0"
              : ""
          }
        >
          {inquiry.status}
        </Badge>
      </div>

      {/* Pipeline */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {pipelineSteps.map((step, i) => (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      step.done
                        ? "btn-gradient text-white"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {step.done ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <p className="text-xs mt-2 text-zinc-500">{step.label}</p>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div
                    className={`h-0.5 w-12 mx-1 mt-[-16px] ${
                      step.done ? "bg-orange-400" : "bg-zinc-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Details */}
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
                {inquiry.budget
                  ? `$${Number(inquiry.budget).toLocaleString()}`
                  : "Not specified"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-zinc-500">Name</p>
              <p className="font-medium">{client?.name || "—"}</p>
            </div>
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
      </div>

      {inquiry.message ? (
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
      ) : null}

      {/* Step 1: Send Details Form to Client */}
      {inquiry.status === "new" ? (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-orange-500" />
              Step 1: Send Details Form to Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Send the client a detailed form to collect event specifics (venues, dates, timings, special requests).
            </p>
            <SendDetailsForm
              inquiryId={id}
              clientId={inquiry.client_id || ""}
              intakeForms={intakeForms}
            />
          </CardContent>
        </Card>
      ) : null}

      {/* Step 2: Crew Assignment */}
      {inquiry.status !== "new" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Step 2: Assign Crew
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CrewAssignPanel inquiryId={id} crew={crew} />
          </CardContent>
        </Card>
      ) : null}

      {/* Step 3: Send Contract — only after details received */}
      {inquiry.status !== "new" && inquiry.status !== "archived" ? (
        <Card className="border-orange-200 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              Step 3: Send Contract with Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500 mb-4">
              Review the client&apos;s details, set your price, and send the contract for digital signature.
            </p>
            <Link
              href={`/dashboard/contracts/new?inquiry=${id}&client=${inquiry.client_id}&event_type=${inquiry.event_type}&event_date=${inquiry.event_date || ""}&location=${inquiry.location || ""}&budget=${inquiry.budget || ""}`}
            >
              <Button className="btn-gradient text-white border-0">
                <FileText className="h-4 w-4 mr-2" />
                Create Contract with Price
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {/* Other Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {inquiry.status === "new" ? (
            <form action={markContacted}>
              <Button variant="outline" type="submit">
                Mark Details Received
              </Button>
            </form>
          ) : null}
          {inquiry.status === "contacted" ? (
            <form action={markConverted}>
              <Button variant="outline" type="submit">
                Mark as Booked
              </Button>
            </form>
          ) : null}
          {inquiry.status !== "archived" ? (
            <form action={markArchived}>
              <Button variant="destructive" type="submit">
                Archive
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
