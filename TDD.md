# StudioFlow — Test Plan & Status

## Status Legend
- [ ] Planned
- [x] Passing
- [!] Failing

---

## Auth
- [ ] Login with valid credentials redirects to /dashboard
- [ ] Login with invalid credentials shows error
- [ ] Signup creates user, profile, and organization automatically
- [ ] Unauthenticated users redirected from /dashboard to /login
- [ ] Logout clears session and redirects to /login
- [ ] Freelancer login shows limited portal (not full dashboard)

## Multi-Tenancy
- [ ] Each signup creates a unique organization with slug
- [ ] RLS isolates data between organizations
- [ ] Company branding (name, description, color) saved and displayed
- [ ] Public forms show the correct company's branding
- [ ] Different companies can't see each other's data

## Clients
- [ ] Create client with name, email, phone
- [ ] Search clients by name or email
- [ ] View client detail with related bookings/inquiries/contracts
- [ ] Update client info
- [ ] Clients are scoped to organization (RLS)

## Inquiries
- [ ] Public inquiry form submits successfully
- [ ] Public inquiry form shows company branding (name, logo, color)
- [ ] Inquiry creates client if not existing
- [ ] Inquiry list shows all org inquiries
- [ ] Filter inquiries by status (new, contacted, converted, archived)
- [ ] Update inquiry status
- [ ] Pipeline status shows correct steps
- [ ] Invalid org slug shows error on public form

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
- [ ] Create contract with pre-filled inquiry data
- [ ] Manual price entry on contract
- [ ] Budget hint from inquiry displayed
- [ ] Send contract updates status to "sent"
- [ ] Public contract page marks as "viewed" on first load
- [ ] Signature pad captures drawing
- [ ] Sign contract updates status to "signed"
- [ ] Signing auto-creates tentative booking with price
- [ ] Signed contract shows signature image

## Bookings
- [ ] Create booking with client, date, time
- [ ] Double-booking prevention (overlapping times on same date)
- [ ] Calendar shows bookings on correct dates
- [ ] Update booking status (tentative -> confirmed -> completed)
- [ ] Cancel booking
- [ ] Booking shows assigned crew
- [ ] Bookings scoped to organization (RLS)

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
- [ ] Inquiry submission logs to workflow_logs
- [ ] Contract signing logs to workflow_logs
- [ ] Contract signing auto-creates booking

## Landing Page
- [ ] Landing page renders with hero, features, pricing, testimonials, CTA
- [ ] Warm gradient theme (purple hero, orange-to-pink buttons)
- [ ] DM Sans font applied
- [ ] Navigation links to /login and /signup work
- [ ] Responsive on mobile

---

## Test Coverage Summary
- **Total test cases:** 68
- **Passing:** 0
- **Failing:** 0
- **Not yet implemented:** 68

> Tests not yet written — to be added with Vitest/Playwright in next phase.
