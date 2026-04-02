# StudioFlow — Development Log

---

## 2026-03-31 — Initial Build

- Scaffolded Next.js 16 + Tailwind + shadcn/ui + Supabase
- Built all core features: auth, dashboard, clients, inquiries, intake forms, contracts, bookings, analytics, recommendations, settings, landing page
- 21 routes, 66 files, 7,357 lines
- Problems: shadcn/ui base-ui (no asChild), Next.js 16 middleware deprecation, Recharts types, Supabase join casting

---

## 2026-04-01 — Full Feature Build, Testing, Polish

### Infrastructure
- Created Supabase project (us-east-1), applied schema, created demo user
- Fixed signup trigger (combined into single function for FK ordering)
- Deployed to Vercel (studioflow-sage.vercel.app), set all env vars
- Fixed RLS: created `get_user_org_ids()` SECURITY DEFINER function, updated all 13 table policies
- Fixed missing RLS policies: intake_responses (INSERT/UPDATE), booking_assignments, contract_templates
- Dashboard stats switched to admin client (RLS workaround for bookings)

### Design
- Generated 3 landing page designs via superdesign MCP, applied Design 3 (warm gradient)
- Purple hero, orange-to-pink buttons, DM Sans font
- Themed entire app: auth pages, sidebar, landing page, emails

### Crew & Booking Pipeline
- New tables: crew_members, booking_assignments
- Crew management page with team + external freelancers + invite system
- Freelancer portal with limited dashboard
- Enhanced inquiry detail: 5-step pipeline, crew assignment, send details form, send contract
- Enhanced contract creation: template selection, auto-fill, price required
- Enhanced booking detail: assigned crew display
- Auto-booking extracts price/date/location/event type from contract JSONB

### Multi-Tenant Branding
- Added org fields: description, website, email, phone, address, brand color, industry
- Settings page with Company tab + brand color picker
- Public forms show company branding dynamically

### Contract System
- Created Photography Client Agreement template from RK Studios PDF (11 clauses)
- Template selector on contract creation
- Auto-fill: client name/email/phone (from client), date/location (from inquiry) — read-only
- Price: manual entry, required (red warning without it)
- Signing link: clickable Input with Copy + Open buttons (fixed line break issue)

### Inquiry Enhancements
- Simplified inquiry form: removed budget, added multi-day events (up to 5)
- Each day: event name + date + hours (2/4/6/8/10/12+)
- Details form step: send Wedding Details Form (22 fields) to client before contract
- Re-send details form at any time without changing status
- Inquiry list: status icons (🟠🕐✅📦) + context-aware "Next Step" buttons
- Manual inquiry creation from dashboard

### Email System (Resend)
- 5 transactional emails, all company-branded:
  1. Inquiry received → owner
  2. Details form sent → client (with form link)
  3. Contract sent → client (with signing link)
  4. Contract signed → owner
  5. Booking confirmed → client
- All emails use: company name in FROM, brand color in gradients, footer with contact details
- Created `getCompanyInfo()` helper + `CompanyInfo` type
- Fixed `NEXT_PUBLIC_APP_URL` line break in generated links

### Bug Fixes
- RLS self-referencing subquery → SECURITY DEFINER function
- Missing intake_responses INSERT policy → added
- Dashboard stats empty → admin client
- Booking price/date/location wrong → extract from contract JSONB
- Signing link breaking across lines → Input + Copy + Open
- Email link line break → trim APP_URL
- Two booking RLS policies conflicting → merged

### Browser Testing (13+ tests passed end-to-end)
- Login → Dashboard → Create Inquiry → Send Details Form → Send Contract → Client Signs → Booking Created → Stats Updated
