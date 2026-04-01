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

## 2026-04-01 — Supabase, Design, Crew, Multi-Tenant Branding

### What was done

**Supabase Setup**
- Created Supabase project "studioflow" in us-east-1
- Applied full schema migration (001_initial_schema) via MCP
- Seeded 15 recommendations
- Fixed signup trigger: combined handle_new_user + handle_new_org into single trigger to avoid FK ordering issue
- Created demo user (demo@studioflow.app / Demo123456!)

**Design Theme — Warm Gradient (Design 3)**
- Generated 3 landing page designs using superdesign MCP
- User chose Design 3: warm gradient (purple hero, orange-to-pink buttons)
- Applied theme to entire app: CSS variables, landing page, auth pages, sidebar
- Switched font from Geist to DM Sans
- Added custom CSS: hero-gradient, btn-gradient, accent-gradient-text, card-gradient-bg
- Landing page now has: hero, features (4 cards), workflow steps, testimonials (3), pricing (3 tiers), CTA

**Crew Management & Booking Pipeline**
- New tables: crew_members, booking_assignments (migration 002)
- Crew page at /dashboard/crew: add/edit/delete team + external freelancers
- Invite freelancers: creates Supabase auth user with "freelancer" role
- Enhanced inquiry detail: pipeline status bar (Submitted → Crew Assigned → Contract Sent → Booked)
- Crew assignment panel on inquiry detail: pick photographers and videographers
- Enhanced contract creation: pre-fills from inquiry data, manual price entry, budget hint
- Enhanced booking detail: shows assigned crew with role badges, add/remove crew
- Added "Crew" to sidebar navigation

**Freelancer Portal**
- New role: "freelancer" in org_members
- FreelancerSidebar component (My Bookings + Settings only)
- Dashboard page detects role and shows freelancer view (only their assigned bookings)
- RLS policies: freelancers can only see bookings they're assigned to
- Booking cards show date, location, time, client name, their role

**Multi-Tenant Company Branding**
- New org fields: description, website, email, phone, address, primary_color, industry (migration 003)
- Enhanced settings page with Company tab: full branding form with color picker
- Public inquiry form shows company: logo (brand color), name, description, contact info
- Brand color applied to public form buttons dynamically
- "Powered by StudioFlow" footer on public pages
- Public Links tab in settings with inquiry URL and slug

**Deployment**
- Pushed to GitHub (arsalseemab98/studioflow)
- Deployed to Vercel (studioflow-sage.vercel.app)
- Set all env vars via Vercel CLI
- Multiple successful production deploys

### Decisions
- Combined two signup triggers into one to fix FK ordering issue
- Used role-based rendering (isFreelancer) instead of separate routes
- Kept crew assignment client-side state for now (not persisted until booking created)
- Manual price entry chosen over package-based pricing (simpler for v1)
- Company brand color applied via inline styles on public pages (dynamic per org)

### Problems encountered
- Supabase signup failed due to two separate triggers with FK dependency — fixed by combining into one
- `unknown` type from Supabase joins can't use `&&` in JSX — must use ternary `? : null`
- React rendering `unknown` types causes TypeScript errors — need explicit `as string` casts
