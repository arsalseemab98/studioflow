"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Camera } from "lucide-react";
import type { Recommendation } from "@/types/database";

const eventTypes = ["all", "wedding", "engagement", "portrait", "corporate"];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [eventType, setEventType] = useState("all");
  const [category, setCategory] = useState<"location" | "pose">("location");

  useEffect(() => {
    loadRecommendations();
  }, [eventType, category]);

  async function loadRecommendations() {
    const supabase = createClient();
    let query = supabase
      .from("recommendations")
      .select("*")
      .eq("category", category);

    if (eventType !== "all") {
      query = query.eq("event_type", eventType);
    }

    const { data } = await query;
    setRecommendations((data as Recommendation[]) || []);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Suggestions</h1>

      <Tabs value={category} onValueChange={(v) => setCategory(v as "location" | "pose")}>
        <TabsList>
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            Locations
          </TabsTrigger>
          <TabsTrigger value="pose">
            <Camera className="h-4 w-4 mr-2" />
            Poses
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2 flex-wrap">
        {eventTypes.map((t) => (
          <button
            key={t}
            onClick={() => setEventType(t)}
            className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
              eventType === t
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="overflow-hidden">
            {rec.image_url && (
              <div className="h-40 bg-zinc-200">
                <img
                  src={rec.image_url}
                  alt={rec.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardContent className={rec.image_url ? "pt-4" : "pt-6"}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{rec.title}</h3>
                  <p className="text-xs text-zinc-500 capitalize mt-1">
                    {rec.event_type}
                  </p>
                </div>
                {category === "location" ? (
                  <MapPin className="h-4 w-4 text-zinc-400" />
                ) : (
                  <Camera className="h-4 w-4 text-zinc-400" />
                )}
              </div>
              {rec.description && (
                <p className="text-sm text-zinc-600 mt-2">{rec.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
        {recommendations.length === 0 && (
          <p className="text-sm text-zinc-500 col-span-full">
            No suggestions found for this category.
          </p>
        )}
      </div>
    </div>
  );
}
