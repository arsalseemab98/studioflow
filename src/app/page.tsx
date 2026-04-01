import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileText,
  Send,
  ClipboardList,
  BarChart3,
  Lightbulb,
  Star,
  Check,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Digital Contracts & E-Sign",
    description:
      "Create professional contracts from templates. Clients sign digitally from any device. Track sent, viewed, and signed in real time.",
  },
  {
    icon: Calendar,
    title: "Smart Booking Calendar",
    description:
      "Beautiful monthly view with automatic conflict detection. Never double-book again. Manage status from tentative to completed.",
  },
  {
    icon: Send,
    title: "Lead Capture & Inquiries",
    description:
      "Shareable public forms branded to your studio. Capture event type, date, budget, and details. Instant notifications.",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "See monthly revenue trends, booking funnels, conversion rates, and your top clients. Data-driven decisions for your studio.",
  },
];

const steps = [
  { num: "1", title: "Inquiry", desc: "Client fills your form" },
  { num: "2", title: "Intake", desc: "Questionnaire sent auto" },
  { num: "3", title: "Contract", desc: "Signed digitally" },
  { num: "4", title: "Booked", desc: "On your calendar" },
];

const testimonials = [
  {
    quote:
      "StudioFlow transformed how I run my studio. The automated pipeline from inquiry to booking is incredible. My clients love it.",
    name: "Sarah Chen",
    role: "Wedding Photographer",
  },
  {
    quote:
      "10 hours saved per week, easily. The contract signing flow is so smooth — clients are impressed every time.",
    name: "Marcus Rivera",
    role: "Event Planner",
  },
  {
    quote:
      "The analytics dashboard helped me see where leads drop off. I increased my conversion rate by 40% in two months.",
    name: "Emma Nakamura",
    role: "Portrait Photographer",
  },
];

const plans = [
  {
    name: "Free",
    desc: "Solo creatives",
    price: "$0",
    period: "",
    features: ["5 bookings/month", "3 templates", "Public inquiry form", "Basic analytics"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    desc: "Growing studios",
    price: "$29",
    period: "/month",
    features: [
      "Unlimited bookings",
      "Unlimited contracts",
      "5 team members",
      "Full analytics",
      "Priority support",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    name: "Studio",
    desc: "Agencies",
    price: "$79",
    period: "/month",
    features: [
      "Everything in Pro",
      "Unlimited team",
      "White-label",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 btn-gradient rounded-lg" />
            <span className="text-xl font-bold">StudioFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-zinc-900 transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="btn-gradient text-white border-0 rounded-full px-5"
              >
                Try free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-gradient pt-36 pb-28 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white border-white/20 backdrop-blur mb-8 px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Trusted by 2,500+ studios
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
            Run your studio,
            <br />
            <span className="accent-gradient-text">not your admin.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Bookings, contracts, and client management for photographers and
            event planners. Beautiful. Simple. Powerful.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="btn-gradient text-white border-0 rounded-full text-base px-8 shadow-lg shadow-orange-500/25"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="#how">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full text-base px-8 bg-white/10 backdrop-blur text-white border-white/20 hover:bg-white/20"
              >
                Watch demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 px-6 border-b border-zinc-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">
            Trusted by studios worldwide
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-20">
            {[96, 80, 112, 96, 80].map((w, i) => (
              <div
                key={i}
                className="h-8 bg-zinc-400 rounded"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-orange-500 mb-3">FEATURES</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              Everything in one place
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className={`card-gradient-bg border ${
                  i % 2 === 0 ? "border-orange-100/50" : "border-pink-100/50"
                }`}
              >
                <CardContent className="p-8">
                  <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center mb-5 text-white">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-zinc-500 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-orange-500 mb-3">
            HOW IT WORKS
          </p>
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            Inquiry to booking in 4 steps
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num}>
                <div className="w-16 h-16 mx-auto rounded-2xl btn-gradient text-white text-2xl font-bold flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                  {step.num}
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-zinc-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Loved by studios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4 text-orange-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full btn-gradient" />
                    <div>
                      <p className="font-medium text-sm">{t.name}</p>
                      <p className="text-xs text-zinc-400">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-orange-500 mb-3">PRICING</p>
            <h2 className="text-3xl md:text-5xl font-bold">
              Plans for every studio
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.highlighted
                    ? "border-2 border-transparent"
                    : ""
                }`}
                style={
                  plan.highlighted
                    ? {
                        background:
                          "linear-gradient(white, white) padding-box, linear-gradient(135deg, #f97316, #ec4899) border-box",
                        borderColor: "transparent",
                      }
                    : undefined
                }
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 px-4 py-1 btn-gradient text-white text-xs font-semibold rounded-bl-xl">
                    Best value
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <p className="text-sm text-zinc-400 mb-6">{plan.desc}</p>
                  <p className="text-5xl font-bold mb-1">{plan.price}</p>
                  <p className="text-sm text-zinc-400 mb-8">{plan.period || "\u00A0"}</p>
                  <ul className="space-y-3 text-sm text-zinc-600 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-orange-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/signup" className="block">
                    <Button
                      className={`w-full rounded-full ${
                        plan.highlighted
                          ? "btn-gradient text-white border-0 shadow-lg shadow-orange-500/25"
                          : ""
                      }`}
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 hero-gradient text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start running your studio
            <br />
            the smart way
          </h2>
          <p className="text-white/50 text-lg mb-10">
            Free forever. No credit card needed.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full text-base px-10 shadow-lg"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-100 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-400">
          <span className="font-semibold text-zinc-600">StudioFlow</span>
          <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
