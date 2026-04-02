# StudioFlow

## Project Overview
Multi-tenant SaaS for photographers, wedding planners, and event planners. Each company signs up, brands their workspace, and manages bookings, contracts, inquiries, crew, and client relationships — all isolated via Supabase RLS.

## Live URLs
- **Production:** https://studioflow-sage.vercel.app
- **GitHub:** https://github.com/arsalseemab98/studioflow
- **Supabase:** https://supabase.com/dashboard/project/rckgihtmqlbwwjvdzila
- **Demo login:** demo@studioflow.app / Demo123456!

## Tech Stack
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + shadcn/ui (base-ui)
- **Backend:** Supabase (Auth, Postgres, Storage, Realtime)
- **Font:** DM Sans (Google Fonts)
- **Theme:** Warm gradient (purple hero, orange-to-pink accents)
- **Email:** Resend (5 transactional emails, company-branded)
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer (not yet wired)
- **Deployment:** Vercel

## Complete Workflow
```
1. Client submits simple inquiry (name, email, event type, multi-day dates/hours)
2. Studio sends "Details Form" to client (email with link)
3. Client fills detailed form (bride/groom, 3 events, venues, times)
4. Studio reviews answers → assigns crew
5. Studio creates contract → selects template → MUST enter price
6. Client receives email → signs digitally
7. Booking auto-created (confirmed, with price/date/location)
8. Both parties get email confirmations
9. Freelancers log in → see only their assigned bookings
```

## Email System (Resend — Company Branded)
All emails use the company's branding: name in FROM, brand color in gradients, footer with email/phone/website/address, "Powered by StudioFlow" at bottom.

| # | Trigger | Recipient | Subject |
|---|---------|-----------|---------|
| 1 | Inquiry submitted | Studio owner | "New inquiry from X" |
| 2 | Details form sent | Client | "Company — Please fill out your event details" |
| 3 | Contract sent | Client | "Company — Contract ready for your signature" |
| 4 | Contract signed | Studio owner | "X signed the contract!" |
| 5 | Contract signed | Client | "Booking confirmed with Company!" |

Key files: `src/lib/email.ts` (templates + sendEmail), `src/lib/get-company.ts` (fetches org branding)

## Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypasses RLS)
- `RESEND_API_KEY` (server-only, sends emails)
- `NEXT_PUBLIC_APP_URL` (must have NO trailing newline — trim it)

## Key Directories
```
src/actions/       Server Actions (clients, bookings, crew, contracts, inquiries, intake-forms, analytics, dashboard)
src/app/           Pages and routes (22+ routes)
src/components/    UI components (layout, dashboard, forms, contracts)
src/lib/           email.ts, get-company.ts, supabase clients
src/types/         TypeScript types (database.ts)
supabase/          SQL migrations (001-005)
docs/plans/        Design docs
```

## Database (15 tables, 5 migrations)
organizations, profiles, org_members, clients, inquiries, intake_forms, intake_responses, contract_templates, contracts, bookings, workflow_logs, recommendations, crew_members, booking_assignments

Key functions: `get_user_org_ids()` (SECURITY DEFINER for RLS), `handle_new_user_complete()` (signup trigger)

## Roles
| Role | Access |
|------|--------|
| owner | Full access, manage org settings, team |
| admin | Full access, manage team |
| member | Full access to data |
| freelancer | Only sees their assigned bookings |

## Contract Templates
- **Simple Contract** — basic terms, free text
- **Photography Client Agreement** — 11-clause professional template (RK Studios): scope, payment, work product, rescheduling, cancellation, indemnification, timeline, permissions, exclusive photographer, copyright, social media license

## Intake Form Templates
- **Wedding Details Form** — 22 fields: bride/groom, contact, 3 events (name/date/time/venue/address), notes

## Inquiry Features
- Multi-day events (up to 5 days, each with name/date/hours)
- Status icons on list: 🟠 New, 🕐 Details Received, ✅ Booked, 📦 Archived
- Context-aware "Next Step" buttons: Send Details Form → Send Contract → Complete
- Re-send details form at any time
- Price required on contracts (red warning + disabled button)

## Important Notes
- shadcn/ui uses `@base-ui/react` — NO `asChild` prop
- Next.js 16: `middleware.ts` deprecated → should be `proxy.ts`
- `unknown` type from Supabase: use ternary `? : null`, cast `as unknown as Record<>`
- Dashboard stats use admin client (RLS workaround)
- RLS uses `get_user_org_ids()` SECURITY DEFINER function
- `NEXT_PUBLIC_APP_URL` must be trimmed (no trailing newline)
- Auto-booking extracts price/date/location from contract JSONB
- All emails pass CompanyInfo for branded templates

## Coding Conventions
- Server Actions in `src/actions/` — one file per domain
- `getUser()` for auth, `createAdminClient()` for public ops + dashboard stats
- `getCompanyInfo(orgId)` for email branding
- `sendEmail({ to, subject, html, company })` for all emails
- `revalidatePath()` after mutations
- Email templates in `src/lib/email.ts` — each returns `{ subject, html }`

## Documentation
- **TDD.md** — test cases, update BEFORE/DURING/AFTER coding
- **DEVLOG.md** — date-stamped session entries
- **PROBLEMS.md** — known issues and blockers
