import { getBooking, updateBookingStatus } from "@/actions/bookings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) notFound();

  const client = booking.clients as Record<string, string> | null;

  async function confirm() {
    "use server";
    await updateBookingStatus(id, "confirmed");
  }
  async function complete() {
    "use server";
    await updateBookingStatus(id, "completed");
  }
  async function cancel() {
    "use server";
    await updateBookingStatus(id, "cancelled");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{booking.title}</h1>
          <p className="text-zinc-500 text-sm">
            {client?.name} &middot;{" "}
            {format(new Date(booking.event_date), "MMMM d, yyyy")}
          </p>
        </div>
        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
          {booking.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500">Event Type</p>
            <p className="font-medium capitalize">{booking.event_type || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500">Location</p>
            <p className="font-medium">{booking.location || "—"}</p>
          </div>
          <div>
            <p className="text-zinc-500">Time</p>
            <p className="font-medium">
              {booking.start_time
                ? `${format(new Date(booking.start_time), "h:mm a")} - ${
                    booking.end_time
                      ? format(new Date(booking.end_time), "h:mm a")
                      : "TBD"
                  }`
                : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-zinc-500">Price</p>
            <p className="font-medium">${Number(booking.total_price).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      {booking.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-600 whitespace-pre-wrap">{booking.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {booking.status === "tentative" && (
            <form action={confirm}>
              <Button type="submit">Confirm Booking</Button>
            </form>
          )}
          {booking.status === "confirmed" && (
            <form action={complete}>
              <Button type="submit">Mark Completed</Button>
            </form>
          )}
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <form action={cancel}>
              <Button variant="destructive" type="submit">
                Cancel Booking
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
