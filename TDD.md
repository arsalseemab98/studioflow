# StudioFlow — Test Plan & Status

## Status Legend
- [ ] Planned
- [x] Passing
- [!] Failing

---

## Auth
- [ ] Login with valid credentials redirects to /dashboard
- [ ] Login with invalid credentials shows error
- [ ] Signup creates user, profile, and organization
- [ ] Unauthenticated users redirected from /dashboard to /login
- [ ] Logout clears session and redirects to /login

## Clients
- [ ] Create client with name, email, phone
- [ ] Search clients by name or email
- [ ] View client detail with related bookings/inquiries/contracts
- [ ] Update client info
- [ ] Clients are scoped to organization (RLS)

## Inquiries
- [ ] Public inquiry form submits successfully
- [ ] Inquiry creates client if not existing
- [ ] Inquiry list shows all org inquiries
- [ ] Filter inquiries by status (new, contacted, converted, archived)
- [ ] Update inquiry status
- [ ] Invalid org slug shows error on public form

## Intake Forms
- [ ] Create intake form with default fields
- [ ] Edit form: add/remove/reorder fields
- [ ] Public form renders fields from JSONB
- [ ] Submit intake response stores answers
- [ ] Already-submitted form shows "already submitted" message
- [ ] Token-based access works without auth

## Contracts
- [ ] Create contract from template with client selected
- [ ] Send contract updates status to "sent"
- [ ] Public contract page marks as "viewed" on first load
- [ ] Signature pad captures drawing
- [ ] Sign contract updates status to "signed"
- [ ] Signing auto-creates tentative booking
- [ ] Signed contract shows signature image

## Bookings
- [ ] Create booking with client, date, time
- [ ] Double-booking prevention (overlapping times on same date)
- [ ] Calendar shows bookings on correct dates
- [ ] Update booking status (tentative -> confirmed -> completed)
- [ ] Cancel booking
- [ ] Bookings scoped to organization (RLS)

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
- [ ] Update organization name
- [ ] View team members
- [ ] Copy public inquiry link

## Workflow Automation
- [ ] Inquiry submission logs to workflow_logs
- [ ] Contract signing logs to workflow_logs
- [ ] Contract signing auto-creates booking

## Landing Page
- [ ] Landing page renders with hero, features, CTA
- [ ] Navigation links to /login and /signup work

---

## Test Coverage Summary
- **Total test cases:** 45
- **Passing:** 0
- **Failing:** 0
- **Not yet implemented:** 45

> Tests not yet written — to be added with Vitest/Playwright in next phase.
