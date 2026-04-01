# StudioFlow — Test Plan & Status

## Status Legend
- [ ] Planned
- [x] Passing (manually verified)
- [!] Failing

---

## Auth
- [x] Login with valid credentials redirects to /dashboard
- [ ] Login with invalid credentials shows error
- [x] Signup creates user, profile, and organization automatically
- [x] Unauthenticated users redirected from /dashboard to /login
- [ ] Logout clears session and redirects to /login
- [ ] Freelancer login shows limited portal (not full dashboard)

## Multi-Tenancy
- [x] Each signup creates a unique organization with slug
- [x] RLS isolates data between organizations (via get_user_org_ids function)
- [ ] Company branding (name, description, color) saved and displayed
- [x] Public forms show the correct company's branding
- [ ] Different companies can't see each other's data

## Clients
- [ ] Create client with name, email, phone
- [ ] Search clients by name or email
- [ ] View client detail with related bookings/inquiries/contracts
- [ ] Update client info
- [x] Clients are scoped to organization (RLS)

## Inquiries
- [x] Public inquiry form submits successfully
- [x] Public inquiry form shows company branding (name, logo, color)
- [x] Inquiry creates client if not existing
- [x] Inquiry list shows all org inquiries
- [ ] Filter inquiries by status (new, contacted, converted, archived)
- [ ] Update inquiry status
- [x] Pipeline status shows correct steps (Submitted → Crew → Contract → Booked)
- [ ] Invalid org slug shows error on public form
- [ ] Manual inquiry creation from dashboard
- [x] Email sent to studio owner on new inquiry

## Crew Management
- [ ] Add team member (photographer, videographer, assistant)
- [ ] Add external freelancer
- [ ] Delete crew member
- [ ] Invite freelancer creates Supabase user with freelancer role
- [ ] Invited freelancer can log in and see portal
- [ ] Crew list shows team and external separately

## Crew Assignment
- [ ] Assign photographer to inquiry
- [ ] Assign videographer to inquiry
- [ ] Assign crew to booking
- [ ] Remove crew from booking
- [ ] Assigned crew shows on booking detail

## Intake Forms
- [ ] Create intake form with default fields
- [ ] Edit form: add/remove/reorder fields
- [ ] Public form renders fields from JSONB
- [ ] Submit intake response stores answers
- [ ] Already-submitted form shows "already submitted" message
- [ ] Token-based access works without auth

## Contracts
- [x] Create contract with pre-filled inquiry data
- [x] Manual price entry on contract
- [x] Budget hint from inquiry displayed
- [x] Select from contract templates (Simple or Photography Client Agreement)
- [x] Template fields auto-fill from inquiry data
- [ ] Template field values editable before sending
- [x] Send contract updates status to "sent"
- [x] Send contract emails client with signing link
- [x] Public contract page marks as "viewed" on first load
- [x] Signature pad captures drawing
- [x] Sign contract updates status to "signed"
- [x] Signing auto-creates confirmed booking with correct price/date/location
- [x] Signing emails studio owner "contract signed" notification
- [x] Signing emails client "booking confirmed" with event details
- [ ] Signed contract shows signature image

## Bookings
- [ ] Create booking with client, date, time
- [ ] Double-booking prevention (overlapping times on same date)
- [ ] Calendar shows bookings on correct dates
- [ ] Update booking status (tentative -> confirmed -> completed)
- [ ] Cancel booking
- [ ] Booking shows assigned crew
- [x] Bookings scoped to organization (RLS via admin client)
- [x] Auto-created booking has correct title (Client Name — event type)
- [x] Auto-created booking has correct price from contract
- [x] Auto-created booking has correct event date from contract
- [x] Auto-created booking has correct location from contract

## Dashboard Stats
- [x] Total Bookings count correct (non-cancelled)
- [x] Pending Inquiries count correct
- [x] Signed Contracts count correct
- [x] Total Revenue calculated from confirmed/completed bookings
- [x] Upcoming Bookings list shows future events
- [x] Recent Inquiries list shows latest inquiries
- [x] Share Inquiry Form card with copy link + email

## Freelancer Portal
- [ ] Freelancer sees only their assigned bookings
- [ ] Freelancer sees limited sidebar (My Bookings + Settings only)
- [ ] Freelancer can see event date, time, venue, client name
- [ ] Freelancer cannot see pricing, contracts, analytics
- [ ] Freelancer can update their profile

## Analytics
- [ ] Revenue chart shows monthly data for last 12 months
- [ ] Funnel shows inquiry -> intake -> contract -> booking counts
- [ ] Event type pie chart renders correctly
- [ ] Top clients sorted by revenue
- [ ] Stats cards show correct totals

## Recommendations
- [ ] Location recommendations load and display
- [ ] Pose recommendations load and display
- [ ] Filter by event type works
- [ ] Seed data present after migration

## Settings
- [ ] Update profile (name, phone)
- [ ] Update company info (name, description, website, email, phone, address)
- [ ] Change brand color
- [ ] Set industry type
- [ ] View team members with roles
- [ ] Copy public inquiry link
- [ ] View company slug

## Workflow Automation
- [x] Inquiry submission logs to workflow_logs
- [x] Contract signing logs to workflow_logs
- [x] Contract signing auto-creates booking with full data

## Email Notifications
- [x] Inquiry submitted → email to studio owner
- [x] Contract sent → email to client with signing link
- [x] Contract signed → email to studio owner
- [x] Contract signed → booking confirmation email to client

## Landing Page
- [x] Landing page renders with hero, features, pricing, testimonials, CTA
- [x] Warm gradient theme (purple hero, orange-to-pink buttons)
- [x] DM Sans font applied
- [ ] Navigation links to /login and /signup work
- [ ] Responsive on mobile

---

## Test Coverage Summary
- **Total test cases:** 82
- **Manually verified:** 32
- **Not yet tested:** 50
- **Automated tests:** 0

> Automated tests not yet written — to be added with Vitest/Playwright in next phase.
