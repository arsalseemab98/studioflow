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
- **Email:** Resend (transactional emails — not yet wired)
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer (not yet wired)
- **Deployment:** Vercel

## Architecture
- Monolithic Next.js app with Server Actions for mutations
- Multi-tenant: organization-based with Supabase RLS isolation
- Token-based public access for clients (no login required)
- Role-based dashboards: admin vs freelancer portal
- State-machine workflow: inquiry → crew assign → contract + price → sign → booking

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
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Key Directories
```
src/actions/       Server Actions (one file per domain: clients, bookings, crew, etc.)
src/app/           Pages and routes (22 routes)
src/components/    UI components (layout, dashboard, forms, contracts)
src/lib/supabase/  Supabase client helpers (client, server, admin, middleware, get-user)
src/types/         TypeScript types (database.ts)
supabase/          SQL migrations (001-003)
docs/plans/        Design docs and implementation plans
```

## Database Tables (13 total)
organizations, profiles, org_members, clients, inquiries, intake_forms, intake_responses, contract_templates, contracts, bookings, workflow_logs, recommendations, crew_members, booking_assignments

## Roles
| Role | Access |
|------|--------|
| owner | Full access, manage org settings, team |
| admin | Full access, manage team |
| member | Full access to data |
| freelancer | Only sees their assigned bookings (limited portal) |

## Important Notes
- shadcn/ui uses `@base-ui/react` — NO `asChild` prop
- Next.js 16: `middleware.ts` is deprecated → should be `proxy.ts` (still using middleware.ts)
- All `params` in page components are async: `params: Promise<{ id: string }>`
- `unknown` type from Supabase joins can't use `&&` in JSX — use ternary `? ... : null` instead
- Database migrations: `supabase/migrations/001-003`
- Custom CSS classes: `hero-gradient`, `btn-gradient`, `accent-gradient-text`, `card-gradient-bg`

## Coding Conventions
- Server Actions in `src/actions/` — one file per domain
- Use `getUser()` from `src/lib/supabase/get-user.ts` for auth + role checks
- Use `createAdminClient()` for public/unauthenticated operations (bypasses RLS)
- Use `isFreelancer` from getUser() for role-based rendering
- Revalidate paths after mutations with `revalidatePath()`
- Public pages use company branding (name, color, logo) from organizations table

## Documentation Requirements
- **TDD.md** — Update BEFORE, DURING, and AFTER coding
- **DEVLOG.md** — Date-stamped entries after every session
- **PROBLEMS.md** — Track known issues and blockers
