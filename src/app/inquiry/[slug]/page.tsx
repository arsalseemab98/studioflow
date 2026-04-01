"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { submitPublicInquiry } from "@/actions/inquiries";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Globe, Mail, Phone, MapPin, Plus, Trash2 } from "lucide-react";

export default function PublicInquiryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [org, setOrg] = useState<Record<string, unknown> | null>(null);
  const [eventDays, setEventDays] = useState([
    { id: "1", name: "", date: "", hours: "" },
  ]);

  useEffect(() => {
    loadOrg();
  }, [slug]);

  async function loadOrg() {
    const supabase = createClient();
    const { data } = await supabase
      .from("organizations")
      .select("*")
      .eq("slug", slug)
      .single();
    setOrg(data);
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await submitPublicInquiry(slug, formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafaf9] p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Inquiry Submitted!</h2>
            <p className="text-zinc-500 text-sm">
              Thank you for reaching out
              {org?.name ? ` to ${org.name as string}` : ""}. We&apos;ll get
              back to you soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const brandColor = (org?.primary_color as string) || "#f97316";

  return (
    <div className="min-h-screen bg-[#fafaf9] p-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Company Header */}
        {org && (
          <div className="text-center space-y-3">
            <div
              className="w-14 h-14 rounded-2xl mx-auto"
              style={{ background: `linear-gradient(135deg, ${brandColor}, #ec4899)` }}
            />
            <div>
              <h1 className="text-2xl font-bold">{org.name as string}</h1>
              {org.description ? (
                <p className="text-sm text-zinc-500 mt-1 max-w-sm mx-auto">
                  {org.description as string}
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
              {org.website ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {(org.website as string).replace(/https?:\/\//, "")}
                </span>
              ) : null}
              {org.email ? (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {org.email as string}
                </span>
              ) : null}
              {org.phone ? (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {org.phone as string}
                </span>
              ) : null}
            </div>
          </div>
        )}

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>
              Tell us about your event and we&apos;ll get back to you shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John & Jane Smith" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="you@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_type">What type of event?</Label>
                <select
                  id="event_type"
                  name="event_type"
                  required
                  className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="wedding">Wedding</option>
                  <option value="engagement">Engagement</option>
                  <option value="portrait">Portrait Session</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday / Party</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Event Days */}
              <div className="space-y-3">
                <Label>Event Day(s)</Label>
                {eventDays.map((day, i) => (
                  <div
                    key={day.id}
                    className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-zinc-500">
                        Day {i + 1}
                      </p>
                      {eventDays.length > 1 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setEventDays(eventDays.filter((d) => d.id !== day.id))
                          }
                          className="text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="Event name (e.g. Ceremony, Reception, Mehndi)"
                        value={day.name}
                        onChange={(e) =>
                          setEventDays(
                            eventDays.map((d) =>
                              d.id === day.id ? { ...d, name: e.target.value } : d
                            )
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="date"
                        required={i === 0}
                        value={day.date}
                        onChange={(e) =>
                          setEventDays(
                            eventDays.map((d) =>
                              d.id === day.id ? { ...d, date: e.target.value } : d
                            )
                          )
                        }
                      />
                      <select
                        value={day.hours}
                        onChange={(e) =>
                          setEventDays(
                            eventDays.map((d) =>
                              d.id === day.id ? { ...d, hours: e.target.value } : d
                            )
                          )
                        }
                        className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Hours...</option>
                        <option value="2">2 hours</option>
                        <option value="4">4 hours</option>
                        <option value="6">6 hours</option>
                        <option value="8">8 hours</option>
                        <option value="10">10 hours</option>
                        <option value="12">12+ hours</option>
                      </select>
                    </div>
                  </div>
                ))}
                {eventDays.length < 5 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setEventDays([
                        ...eventDays,
                        { id: Date.now().toString(), name: "", date: "", hours: "" },
                      ])
                    }
                    className="w-full py-2 text-sm text-orange-500 border border-dashed border-orange-200 rounded-lg hover:bg-orange-50 flex items-center justify-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add another day
                  </button>
                ) : null}
              </div>

              {/* Hidden fields for form submission */}
              <input type="hidden" name="event_date" value={eventDays[0]?.date || ""} />
              <input type="hidden" name="hours" value={JSON.stringify(eventDays.map((d) => ({ name: d.name, date: d.date, hours: d.hours })).filter((d) => d.date))} />

              <div className="space-y-2">
                <Label htmlFor="location">Venue / Location</Label>
                <Input id="location" name="location" placeholder="Venue name & city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Anything else we should know?</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Special requests, number of guests, etc."
                />
              </div>
              <input type="hidden" name="budget" value="" />
              <Button
                type="submit"
                className="w-full text-white border-0"
                style={{ background: `linear-gradient(135deg, ${brandColor}, #ec4899)` }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400">
          Powered by <span className="font-semibold">StudioFlow</span>
        </p>
      </div>
    </div>
  );
}
