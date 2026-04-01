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
- **Email:** Resend (transactional emails — fully wired)
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer (not yet wired)
- **Deployment:** Vercel

## Architecture
- Monolithic Next.js app with Server Actions for mutations
- Multi-tenant: organization-based with Supabase RLS isolation
- Token-based public access for clients (no login required)
- Role-based dashboards: admin vs freelancer portal
- Resend emails at every workflow step

## Complete Workflow
```
1. Client submits simple inquiry (name, email, event type, multi-day dates/hours)
2. Studio sends "Details Form" to client (like RK Studios — bride/groom, 3 events, venues, times)
3. Client fills detailed form → studio reviews answers
4. Studio assigns crew (photographer + videographer)
5. Studio creates contract → selects template → MUST enter price
6. Client receives email with signing link → signs digitally
7. Booking auto-created (confirmed, with price/date/location from contract)
8. Both parties get email confirmations
9. Freelancers log in → see only their assigned bookings
```

## How to Run
```bash
cd /Users/arsalseemab/studioflow
npm run dev        # Dev server at localhost:3000
npm run build      # Production build
npm run lint       # Lint check
```

## Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, bypasses RLS for public forms)
- `RESEND_API_KEY` (server-only, sends transactional emails)
- `NEXT_PUBLIC_APP_URL`

## Key Directories
```
src/actions/       Server Actions (clients, bookings, crew, contracts, inquiries, intake-forms, analytics, dashboard)
src/app/           Pages and routes (22+ routes)
src/components/    UI components (layout, dashboard, forms, contracts)
src/lib/           Utilities (supabase clients, email templates)
src/types/         TypeScript types (database.ts)
supabase/          SQL migrations (001-004)
docs/plans/        Design docs and implementation plans
```

## Database Tables (15 total)
organizations, profiles, org_members, clients, inquiries, intake_forms, intake_responses, contract_templates, contracts, bookings, workflow_logs, recommendations, crew_members, booking_assignments

## Key Functions
- `get_user_org_ids()` — SECURITY DEFINER function for RLS policies
- `handle_new_user_complete()` — trigger: creates profile + org + membership on signup

## Roles
| Role | Access |
|------|--------|
| owner | Full access, manage org settings, team |
| admin | Full access, manage team |
| member | Full access to data |
| freelancer | Only sees their assigned bookings (limited portal) |

## Email Workflow (Resend)
| Trigger | Recipient | Template |
|---------|-----------|----------|
| Inquiry submitted | Studio owner | "New inquiry from X" |
| Contract sent | Client | "Contract to sign" + signing link |
| Contract signed | Studio owner | "X signed the contract!" |
| Contract signed | Client | "Booking confirmed" + event details |

## Contract Templates
- **Simple Contract** — basic terms, editable free text
- **Photography Client Agreement** — full 11-clause professional template (RK Studios format)

Templates stored in `contract_templates` table. Dynamic fields auto-fill from client/inquiry data. Price is always manual (required).

## Intake Form Templates
- **Wedding Details Form** — 22 fields: bride/groom names, contact, 3 events (name/date/time/venue/address), notes

## Inquiry Form Features
- Multi-day events (up to 5 days, each with name/date/hours)
- Event types: wedding, engagement, portrait, corporate, birthday, other
- Hours options: 2, 4, 6, 8, 10, 12+
- Data saved as formatted text in inquiry message

## Important Notes
- shadcn/ui uses `@base-ui/react` — NO `asChild` prop
- Next.js 16: `middleware.ts` deprecated → should be `proxy.ts` (still using middleware.ts)
- All `params` in page components are async: `params: Promise<{ id: string }>`
- `unknown` type from Supabase joins: use ternary `? ... : null`, cast with `as unknown as Record<>`
- Dashboard stats use admin client (bypasses RLS) — safe because getUser() verifies session first
- RLS uses `get_user_org_ids()` SECURITY DEFINER function
- Contract creation requires price — shows red warning + disabled button without it
- Inquiry list shows context-aware buttons: "Send Details Form" (new) vs "Send Contract" (contacted)
- Auto-booking extracts price/date/location/event type from contract JSONB content
- Custom CSS: `hero-gradient`, `btn-gradient`, `accent-gradient-text`, `card-gradient-bg`

## Coding Conventions
- Server Actions in `src/actions/` — one file per domain
- Use `getUser()` from `src/lib/supabase/get-user.ts` for auth + role checks
- Use `createAdminClient()` for public/unauthenticated operations + dashboard stats
- Use `isFreelancer` from getUser() for role-based rendering
- Revalidate paths after mutations with `revalidatePath()`
- Email sending via `src/lib/email.ts` — use template functions, call `sendEmail()`

## Documentation
- **TDD.md** — Update BEFORE, DURING, and AFTER coding
- **DEVLOG.md** — Date-stamped entries after every session
- **PROBLEMS.md** — Track known issues and blockers
