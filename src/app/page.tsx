import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  FileText,
  Send,
  ClipboardList,
  BarChart3,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Digital Contracts",
    description:
      "Create, send, and track contracts with built-in e-signatures. Know when clients view and sign.",
  },
  {
    icon: Calendar,
    title: "Booking Calendar",
    description:
      "Manage all your bookings in one place with a visual calendar. Prevent double bookings automatically.",
  },
  {
    icon: Send,
    title: "Inquiry System",
    description:
      "Share a public inquiry form. Receive and manage client requests with automatic notifications.",
  },
  {
    icon: ClipboardList,
    title: "Client Intake Forms",
    description:
      "Build custom questionnaires to collect event details, preferences, and requirements from clients.",
  },
  {
    icon: BarChart3,
    title: "Sales Analytics",
    description:
      "Track revenue, conversion rates, and booking trends. Understand your business at a glance.",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description:
      "Get location and pose recommendations based on event type to inspire your creative work.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">StudioFlow</span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight leading-tight">
            Run your studio,
            <br />
            not your admin.
          </h1>
          <p className="mt-6 text-lg text-zinc-500 max-w-xl mx-auto">
            StudioFlow helps photographers and event planners manage bookings,
            contracts, and clients — all in one beautiful workspace.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8">
                Start Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                See Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-zinc-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Everything you need</h2>
            <p className="mt-3 text-zinc-500">
              From first inquiry to final delivery — streamlined.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 border border-zinc-100"
              >
                <feature.icon className="h-8 w-8 text-zinc-900 mb-4" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Automated Workflow</h2>
          <p className="mt-3 text-zinc-500 mb-12">
            From inquiry to booking — every step happens automatically.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            {[
              "Client Inquires",
              "Intake Form Sent",
              "Contract Signed",
              "Booking Confirmed",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <div className="bg-zinc-900 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <span className="font-medium">{step}</span>
                {i < 3 && (
                  <span className="hidden md:block text-zinc-300 text-xl">
                    &rarr;
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-zinc-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Ready to streamline your studio?</h2>
          <p className="mt-4 text-zinc-400">
            Join photographers and planners who save hours every week with
            StudioFlow.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="mt-8 bg-white text-zinc-900 hover:bg-zinc-100 text-base px-8"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <span>StudioFlow</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
