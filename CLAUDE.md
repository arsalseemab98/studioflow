# StudioFlow

## Project Overview
SaaS application for photographers, wedding planners, and event planners. Manages bookings, contracts, inquiries, intake forms, and client relationships.

## Tech Stack
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + shadcn/ui (base-ui)
- **Backend:** Supabase (Auth, Postgres, Storage, Realtime)
- **Email:** Resend (transactional emails)
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer
- **Deployment:** Vercel

## Architecture
- Monolithic Next.js app with Server Actions for mutations
- Supabase RLS for multi-tenancy (organization-based)
- Token-based public access for clients (no login required)
- State-machine workflow: inquiry -> intake -> contract -> booking

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
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Key Directories
```
src/actions/       Server Actions (all business logic)
src/app/           Pages and routes
src/components/    UI components (layout, dashboard, forms, contracts)
src/lib/supabase/  Supabase client helpers
src/types/         TypeScript types
supabase/          SQL migrations
```

## Important Notes
- shadcn/ui uses `@base-ui/react` — NO `asChild` prop (use render props or direct children)
- Next.js 16: `middleware.ts` is deprecated, should be `proxy.ts` (currently still middleware.ts)
- All `params` in page components are async (Next.js 15+): `params: Promise<{ id: string }>`
- Database schema is in `supabase/migrations/001_initial_schema.sql`

## Coding Conventions
- Server Actions in `src/actions/` — one file per domain (clients.ts, bookings.ts, etc.)
- Use `getUser()` helper from `src/lib/supabase/get-user.ts` for auth checks
- Use `createAdminClient()` for public/unauthenticated operations (bypasses RLS)
- Revalidate paths after mutations with `revalidatePath()`

## Documentation Requirements
- **TDD.md** — Update BEFORE, DURING, and AFTER coding
- **DEVLOG.md** — Date-stamped entries after every session
- **PROBLEMS.md** — Track known issues and blockers
