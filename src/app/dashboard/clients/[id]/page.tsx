import { getClient } from "@/actions/clients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { client, inquiries, bookings, contracts } = await getClient(id);

  if (!client) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{client.name}</h1>
        <p className="text-zinc-500">
          {client.email} {client.phone && `| ${client.phone}`}
        </p>
      </div>

      {client.notes && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-600">{client.notes}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">
            Bookings ({bookings.length})
          </TabsTrigger>
          <TabsTrigger value="inquiries">
            Inquiries ({inquiries.length})
          </TabsTrigger>
          <TabsTrigger value="contracts">
            Contracts ({contracts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-3 mt-4">
          {bookings.length === 0 ? (
            <p className="text-sm text-zinc-500">No bookings</p>
          ) : (
            bookings.map((b: Record<string, unknown>) => (
              <Link
                key={b.id as string}
                href={`/dashboard/bookings/${b.id}`}
                className="block"
              >
                <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{b.title as string}</p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(b.event_date as string), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="secondary">{b.status as string}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="inquiries" className="space-y-3 mt-4">
          {inquiries.length === 0 ? (
            <p className="text-sm text-zinc-500">No inquiries</p>
          ) : (
            inquiries.map((i: Record<string, unknown>) => (
              <Link
                key={i.id as string}
                href={`/dashboard/inquiries/${i.id}`}
                className="block"
              >
                <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{i.event_type as string}</p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(i.created_at as string), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge>{i.status as string}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-3 mt-4">
          {contracts.length === 0 ? (
            <p className="text-sm text-zinc-500">No contracts</p>
          ) : (
            contracts.map((c: Record<string, unknown>) => (
              <Link
                key={c.id as string}
                href={`/dashboard/contracts/${c.id}`}
                className="block"
              >
                <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Contract</p>
                      <p className="text-xs text-zinc-500">
                        {format(new Date(c.created_at as string), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Badge variant="secondary">{c.status as string}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
