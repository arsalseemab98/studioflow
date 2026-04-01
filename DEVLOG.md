# StudioFlow — Development Log

---

## 2026-03-31 — Initial Build (Complete)

### What was done
- Scaffolded Next.js 16 project with Tailwind CSS and shadcn/ui
- Set up Supabase client helpers (browser, server, admin, middleware)
- Wrote full database schema with 11 tables, indexes, RLS policies, and auto-triggers
- Built auth pages (login, signup) with Server Actions
- Built dashboard layout with responsive sidebar and header
- Built dashboard overview with stat cards, upcoming bookings, recent inquiries
- Built client CRM (list, search, detail with tabs for bookings/inquiries/contracts)
- Built public inquiry form at /inquiry/[slug] with auto client creation
- Built inquiry management with status filters and detail page with actions
- Built intake form builder with field types (text, textarea, select, date, checkbox, radio)
- Built public intake form at /form/[token] with dynamic rendering
- Built contract system: templates, editor, send/view/sign flow
- Built canvas-based signature pad (touch-friendly)
- Built booking calendar with monthly grid view and double-booking prevention
- Built analytics dashboard with revenue chart, funnel, event types, top clients
- Built recommendations page with location/pose suggestions filtered by event type
- Built organization settings with profile, org, and team tabs
- Built premium landing page with hero, features grid, workflow steps, CTA
- Added error boundaries, loading states, and 404 page
- Seeded 15 recommendations (locations + poses)
- Build passes successfully — 21 routes, 66 files, 7,357 lines

### Decisions
- Chose monolithic Next.js + Supabase (fastest to ship, simplest infra)
- Used database state machine for workflow instead of Vercel Workflow (simpler for v1)
- Used canvas-based signature instead of third-party lib (lighter, no deps)
- Used Recharts for analytics (best React chart library for our needs)
- No Stripe integration yet (free launch, monetize later)

### Problems encountered
- shadcn/ui v4 uses @base-ui/react instead of Radix — no `asChild` prop
- Next.js 16 deprecates middleware.ts in favor of proxy.ts (kept middleware.ts for now)
- Recharts Tooltip formatter type is strict — needed to use `Number(v)` cast
- Supabase join type casting needed `as unknown as Record<>` for nested relations

---

## 2026-04-01 — Supabase Project Setup

### What was done
- Creating Supabase project for production use
- Created CLAUDE.md, TDD.md, DEVLOG.md, PROBLEMS.md
