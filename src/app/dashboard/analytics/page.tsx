"use client";

import { useEffect, useState } from "react";
import {
  getRevenueStats,
  getFunnelStats,
  getEventTypeStats,
  getTopClients,
} from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#18181b", "#71717a", "#a1a1aa", "#d4d4d8", "#e4e4e7", "#f4f4f5"];

export default function AnalyticsPage() {
  const [revenue, setRevenue] = useState<{ month: string; revenue: number }[]>([]);
  const [funnel, setFunnel] = useState<Record<string, number> | null>(null);
  const [eventTypes, setEventTypes] = useState<{ type: string; count: number; revenue: number }[]>([]);
  const [topClients, setTopClients] = useState<{ name: string; revenue: number; bookings: number }[]>([]);

  useEffect(() => {
    getRevenueStats().then(setRevenue);
    getFunnelStats().then(setFunnel);
    getEventTypeStats().then(setEventTypes);
    getTopClients().then(setTopClients);
  }, []);

  const totalRevenue = revenue.reduce((s, r) => s + r.revenue, 0);
  const totalBookings = funnel?.bookings || 0;
  const conversionRate =
    funnel && funnel.inquiries > 0
      ? ((funnel.bookings / funnel.inquiries) * 100).toFixed(1)
      : "0";
  const avgValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const funnelData = funnel
    ? [
        { stage: "Inquiries", count: funnel.inquiries },
        { stage: "Intake Forms", count: funnel.intakeForms },
        { stage: "Contracts", count: funnel.signedContracts },
        { stage: "Bookings", count: funnel.bookings },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Total Bookings</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Conversion Rate</p>
            <p className="text-2xl font-bold">{conversionRate}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-500">Avg Booking Value</p>
            <p className="text-2xl font-bold">${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => v.substring(5)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#18181b"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="stage"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#18181b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={eventTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {eventTypes.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {topClients.length === 0 ? (
              <p className="text-sm text-zinc-500">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topClients.map((client, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-zinc-500">
                        {client.bookings} booking{client.bookings !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <p className="font-medium">${client.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
