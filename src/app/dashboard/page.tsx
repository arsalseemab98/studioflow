import {
  getDashboardStats,
  getUpcomingBookings,
  getRecentInquiries,
} from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Send, DollarSign } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const [stats, bookings, inquiries] = await Promise.all([
    getDashboardStats(),
    getUpcomingBookings(),
    getRecentInquiries(),
  ]);

  const statCards = [
    {
      label: "Total Bookings",
      value: stats?.totalBookings || 0,
      icon: Calendar,
    },
    {
      label: "Pending Inquiries",
      value: stats?.pendingInquiries || 0,
      icon: Send,
    },
    {
      label: "Signed Contracts",
      value: stats?.signedContracts || 0,
      icon: FileText,
    },
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-zinc-300" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-zinc-500">No upcoming bookings</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking: Record<string, unknown>) => (
                  <Link
                    key={booking.id as string}
                    href={`/dashboard/bookings/${booking.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{booking.title as string}</p>
                      <p className="text-xs text-zinc-500">
                        {(booking.clients as Record<string, string>)?.name} &middot;{" "}
                        {format(new Date(booking.event_date as string), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="secondary">{booking.status as string}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <p className="text-sm text-zinc-500">No inquiries yet</p>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inquiry: Record<string, unknown>) => (
                  <Link
                    key={inquiry.id as string}
                    href={`/dashboard/inquiries/${inquiry.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {(inquiry.clients as Record<string, string>)?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {inquiry.event_type as string} &middot;{" "}
                        {format(new Date(inquiry.created_at as string), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge
                      variant={inquiry.status === "new" ? "default" : "secondary"}
                    >
                      {inquiry.status as string}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
