# StudioFlow — Known Problems & Issues

## Status Legend
- **OPEN** — Known issue, not yet fixed
- **IN PROGRESS** — Being worked on
- **RESOLVED** — Fixed
- **WONTFIX** — Accepted, not worth fixing

---

## OPEN

### P1: middleware.ts deprecated in Next.js 16
**Severity:** Low (works but shows warning)
**Description:** Next.js 16 renames `middleware.ts` to `proxy.ts`. Current build shows deprecation warning.
**Impact:** No functional impact, just a build warning.
**Fix:** Rename to `proxy.ts` and update to Node.js runtime.

### P2: No email notifications yet
**Severity:** Medium
**Description:** Resend is installed but not wired up. Inquiry submissions, contract sends, and booking confirmations don't send emails.
**Impact:** Users don't get notified of new inquiries or contract signings via email.
**Fix:** Create email templates in `src/lib/email-templates.ts` and call Resend API in Server Actions.

### P3: No PDF generation for signed contracts
**Severity:** Medium
**Description:** `@react-pdf/renderer` is installed but PDF generation after contract signing is not implemented.
**Impact:** Signed contracts don't have a downloadable PDF.
**Fix:** Create PDF template component and generate on sign, upload to Supabase Storage.

### P4: Team invite system not functional
**Severity:** Low
**Description:** Settings page shows invite UI but button is disabled. No invite flow implemented.
**Impact:** Can't add team members through the app.
**Fix:** Implement Supabase auth invite + org_members insertion.

### P5: No Google Calendar sync
**Severity:** Low
**Description:** Bookings only exist in-app, no external calendar sync.
**Impact:** Users must manually check StudioFlow for bookings.
**Fix:** Integrate Google Calendar API for two-way sync.

### P6: Form builder lacks drag-and-drop
**Severity:** Low
**Description:** Fields can be added/removed but not reordered via drag-and-drop.
**Impact:** Must delete and re-add fields to change order.
**Fix:** Add @dnd-kit or similar drag-and-drop library.

### P7: No file upload for mood boards / shot lists
**Severity:** Low
**Description:** Supabase Storage is available but no file upload UI exists.
**Impact:** Can't share files with clients through the app.
**Fix:** Add file upload component using Supabase Storage.

### P8: Contract templates are hardcoded
**Severity:** Medium
**Description:** New contracts use a single hardcoded template. The contract_templates table exists but there's no UI to create/manage templates.
**Impact:** All contracts look the same.
**Fix:** Build template management CRUD in /dashboard/contracts/templates.

### P9: No automated tests
**Severity:** Medium
**Description:** TDD.md lists 45 test cases but none are implemented.
**Impact:** No automated regression testing.
**Fix:** Set up Vitest for unit tests, Playwright for E2E tests.

---

## RESOLVED

### R1: asChild prop not supported in base-ui
**Resolved:** 2026-03-31
**Description:** shadcn/ui v4 uses @base-ui/react which doesn't support Radix's `asChild` prop.
**Fix:** Removed all `asChild` props from DialogTrigger, DropdownMenuTrigger, and DropdownMenuItem.

### R2: Recharts Tooltip type error
**Resolved:** 2026-03-31
**Description:** `formatter={(v: number) => ...}` type error with Recharts Tooltip.
**Fix:** Changed to `formatter={(v) => \`$${Number(v).toLocaleString()}\`}`.

### R3: Supabase nested relation type casting
**Resolved:** 2026-03-31
**Description:** `b.clients as Record<string, string>` fails type check on array relations.
**Fix:** Used `as unknown as Record<string, string>` double cast.
