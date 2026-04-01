"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookings, createBooking } from "@/actions/bookings";
import { getClients } from "@/actions/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import type { Client } from "@/types/database";

export default function BookingsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, [currentMonth]);

  useEffect(() => {
    getClients().then((d) => setClients(d as Client[]));
  }, []);

  async function loadBookings() {
    const month = format(currentMonth, "yyyy-MM");
    const data = await getBookings(month);
    setBookings(data);
  }

  async function handleCreate(formData: FormData) {
    setError(null);
    const result = await createBooking(formData);
    if (result.error) {
      setError(result.error);
    } else {
      setOpen(false);
      loadBookings();
    }
  }

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month
  const startPad = monthStart.getDay();
  const paddedDays = Array(startPad).fill(null).concat(days);

  function getBookingsForDay(date: Date) {
    return bookings.filter(
      (b) => b.event_date && isSameDay(new Date(b.event_date as string), date)
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>New Booking</DialogTitle>
            </DialogHeader>
            <form action={handleCreate} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label>Client</Label>
                <select name="client_id" required className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
                  <option value="">Select...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input name="title" required placeholder="e.g. Johnson Wedding" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <select name="event_type" className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm">
                    <option value="wedding">Wedding</option>
                    <option value="engagement">Engagement</option>
                    <option value="portrait">Portrait</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <Input name="event_date" type="date" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input name="start_time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input name="end_time" type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" placeholder="Venue name or address" />
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input name="total_price" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea name="notes" rows={2} />
              </div>
              <Button type="submit" className="w-full">Create Booking</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {format(currentMonth, "MMMM yyyy")}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-medium text-zinc-500 py-2">
                {d}
              </div>
            ))}
            {paddedDays.map((day, i) => {
              if (!day) {
                return <div key={`pad-${i}`} className="h-20" />;
              }
              const dayBookings = getBookingsForDay(day);
              return (
                <div
                  key={day.toISOString()}
                  className={`h-20 border rounded p-1 text-xs ${
                    isToday(day)
                      ? "bg-blue-50 border-blue-200"
                      : "border-zinc-100"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      !isSameMonth(day, currentMonth)
                        ? "text-zinc-300"
                        : ""
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayBookings.slice(0, 2).map((b) => (
                    <Link
                      key={b.id as string}
                      href={`/dashboard/bookings/${b.id}`}
                      className="block mt-0.5 text-[10px] bg-zinc-900 text-white rounded px-1 truncate hover:bg-zinc-700"
                    >
                      {b.title as string}
                    </Link>
                  ))}
                  {dayBookings.length > 2 && (
                    <span className="text-[10px] text-zinc-400">
                      +{dayBookings.length - 2} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
