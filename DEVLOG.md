# StudioFlow — Development Log

---

## 2026-03-31 — Initial Build (Complete)

### What was done
- Scaffolded Next.js 16 project with Tailwind CSS and shadcn/ui
- Set up Supabase client helpers (browser, server, admin, middleware)
- Wrote full database schema with 11 tables, indexes, RLS policies, and auto-triggers
- Built auth, dashboard, clients, inquiries, intake forms, contracts, bookings, analytics, recommendations, settings, landing page
- 21 routes, 66 files, 7,357 lines

### Decisions
- Monolithic Next.js + Supabase (fastest to ship)
- Database state machine for workflow
- Canvas-based signature (no deps)
- Recharts for analytics

### Problems
- shadcn/ui v4 uses @base-ui/react — no `asChild` prop
- Next.js 16 deprecates middleware.ts
- Recharts Tooltip formatter type strict
- Supabase join type casting issues

---

## 2026-04-01 — Full Feature Build + Testing

### What was done

**Supabase & Deployment**
- Created Supabase project "studioflow" in us-east-1
- Applied schema, seeded recommendations, created demo user
- Fixed signup trigger (combined into single function)
- Deployed to Vercel (studioflow-sage.vercel.app)
- Set all env vars via Vercel CLI

**Design Theme (Warm Gradient)**
- Generated 3 designs via superdesign MCP, user chose Design 3
- Applied purple hero gradient, orange-to-pink buttons, DM Sans font
- Themed auth pages, sidebar, landing page

**Crew Management & Booking Pipeline**
- New tables: crew_members, booking_assignments (migration 002)
- Crew page with team + external freelancers, invite system
- Enhanced inquiry detail: 5-step pipeline, crew assignment panel
- Enhanced contract creation: pre-fill from inquiry, manual price, template selection
- Enhanced booking detail: assigned crew display
- Freelancer portal: limited sidebar, only their bookings

**Multi-Tenant Company Branding**
- Added org fields: description, website, email, phone, address, brand color, industry (migration 003)
- Settings page with Company tab, brand color picker
- Public forms show company branding dynamically

**RLS Fix (Critical)**
- Self-referencing org_members subqueries caused empty results
- Created `get_user_org_ids()` SECURITY DEFINER function (migration 004)
- Updated all 13 table policies
- Dashboard stats switched to admin client for bookings

**Email Integration (Resend)**
- Wired Resend API for all workflow steps
- 4 email templates: inquiry received, contract sent, contract signed, booking confirmed
- Beautiful HTML emails with gradient accents

**Contract Templates**
- Created "Photography Client Agreement" from RK Studios PDF (11 clauses, 22 sections)
- Template selector on contract creation page
- Auto-fill fields from client/inquiry data (read-only)
- Price field manual + required (red warning without it)
- Signing link now clickable with copy + open buttons

**Details Form Flow**
- Created "Wedding Details Form" intake template (22 fields: couple, 3 events, venues)
- "Send Details Form" step on inquiry detail page
- Pick form template → generate link → send to client
- Pipeline: Inquiry → Details Form → Crew → Contract → Booked
- "Send Details Form" quick button on inquiries list for "new" status

**Inquiry Form Enhancements**
- Simplified form: name, email, phone, event type, multi-day, venue, notes
- Removed budget field (studio sets price)
- Multi-day events: up to 5 days, each with event name + date + hours
- "Add another day" button
- Data formatted as "Day 1 (Ceremony): 2026-07-15 — 8 hours"

**Share Inquiry Link**
- Dashboard card with copy link + email button
- Email opens mail client with pre-written message
- Manual inquiry creation from dashboard

**Bug Fixes**
- Auto-booking now extracts price/date/location from contract JSONB
- Booking title uses "Client Name — event type"
- Booking status set to "confirmed" (was "tentative")
- Dashboard Total Bookings counts non-cancelled (was only confirmed/completed)
- Fixed signing link breaking across lines (now Input + Copy + Open buttons)

### Browser Testing (13 tests passed)
- Login → Dashboard → Inquiries → Inquiry Detail → Pipeline
- Public inquiry form submit → "Inquiry Submitted!"
- Contract creation pre-fill → Contract preview → Send to client
- Signing link → Public contract view → Signature pad → "Contract Signed!"
- Auto-booking created with correct data
- Dashboard stats: 1 booking, 1 inquiry, 1 contract, $5,000 revenue

### Decisions
- Combined two signup triggers into one (FK ordering)
- Used admin client for dashboard stats (RLS issues with bookings)
- Manual price only (no package-based pricing for v1)
- Details form before contract (not optional)
- Inquiry list buttons change based on status (details form vs contract)

### Problems Encountered & Fixed
- RLS self-referencing subquery → SECURITY DEFINER function
- Supabase join `unknown` type in JSX → ternary instead of &&
- Dashboard stats empty → switched to admin client
- Two booking RLS policies conflicting → merged into one
- Signing link breaking across lines → Input + Copy + Open buttons
- Auto-booking price/date was wrong → extract from contract JSONB
- Contract template fields not auto-filling → re-fill on client change
