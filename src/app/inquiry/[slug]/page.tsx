"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { submitPublicInquiry } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PublicInquiryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Inquiry Submitted!</h2>
            <p className="text-zinc-500 text-sm">
              Thank you for reaching out. We&apos;ll get back to you soon.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="max-w-lg w-full">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <select
                  id="event_type"
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
                <Label htmlFor="event_date">Event Date</Label>
                <Input id="event_date" name="event_date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="City or venue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input id="budget" name="budget" type="number" placeholder="e.g. 2000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Tell us more</Label>
              <Textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Share any details about your event..."
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
