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
- [ ] Freelancer login shows limited portal

## Multi-Tenancy
- [x] Each signup creates a unique organization with slug
- [x] RLS isolates data between organizations
- [ ] Company branding saved and displayed on public forms
- [x] Public forms show correct company branding
- [ ] Different companies can't see each other's data

## Clients
- [ ] Create client with name, email, phone
- [ ] Search clients by name or email
- [ ] View client detail with related bookings/inquiries/contracts
- [ ] Update client info
- [x] Clients scoped to organization (RLS)

## Inquiries
- [x] Public inquiry form submits successfully
- [x] Public inquiry form shows company branding
- [x] Inquiry creates client if not existing
- [x] Inquiry list shows all org inquiries
- [ ] Filter inquiries by status
- [ ] Update inquiry status
- [x] Pipeline shows correct steps (Inquiry → Details Form → Crew → Contract → Booked)
- [x] "Send Details Form" button on list for "new" inquiries
- [x] "Send Contract" button on list for "contacted" inquiries
- [ ] Manual inquiry creation from dashboard
- [x] Email sent to studio owner on new inquiry
- [x] Multi-day events: add up to 5 days with name/date/hours
- [x] Multi-day data saved as formatted text in message
- [ ] Remove day button works
- [ ] First day date is required

## Intake Forms / Details Form
- [x] Send details form from inquiry detail page
- [x] Pick from available form templates
- [x] Generates shareable link for client
- [x] Sending marks inquiry as "contacted"
- [ ] Client fills detailed form (bride/groom, events, venues)
- [ ] Submitted form data visible to studio
- [ ] Already-submitted form shows "already submitted" message
- [ ] Wedding Details Form template has 22 fields

## Crew Management
- [ ] Add team member (photographer, videographer, assistant)
- [ ] Add external freelancer
- [ ] Delete crew member
- [ ] Invite freelancer creates Supabase user with freelancer role
- [ ] Crew list shows team and external separately

## Crew Assignment
- [ ] Assign photographer to inquiry
- [ ] Assign videographer to inquiry
- [ ] Assign crew to booking
- [ ] Remove crew from booking
- [ ] Assigned crew shows on booking detail

## Contracts
- [x] Create contract with pre-filled inquiry data
- [x] Manual price entry on contract
- [x] Select from contract templates (Simple or Photography Client Agreement)
- [x] Template fields auto-fill from client/inquiry data (read-only)
- [x] Only price is manual entry (orange highlighted)
- [x] Fields re-fill when client selection changes
- [x] Price is REQUIRED — red warning + disabled button without it
- [x] Send contract updates status to "sent"
- [x] Send contract emails client with signing link
- [x] Signing link is clickable with copy + open buttons
- [x] Public contract page marks as "viewed" on first load
- [x] Signature pad captures drawing
- [x] Sign contract updates status to "signed"
- [x] Signing auto-creates confirmed booking with correct price/date/location
- [x] Signing emails studio owner "contract signed" notification
- [x] Signing emails client "booking confirmed" with event details

## Bookings
- [ ] Create booking with client, date, time
- [ ] Double-booking prevention
- [ ] Calendar shows bookings on correct dates
- [ ] Update booking status
- [ ] Cancel booking
- [ ] Booking shows assigned crew
- [x] Bookings scoped to organization
- [x] Auto-created booking has correct title (Client Name — event type)
- [x] Auto-created booking has correct price from contract
- [x] Auto-created booking has correct event date from contract
- [x] Auto-created booking has correct location from contract

## Dashboard
- [x] Total Bookings count correct (non-cancelled)
- [x] Pending Inquiries count correct
- [x] Signed Contracts count correct
- [x] Total Revenue calculated correctly
- [x] Upcoming Bookings list shows future events
- [x] Recent Inquiries list shows latest
- [x] Share Inquiry Form card with copy link + email button

## Freelancer Portal
- [ ] Freelancer sees only assigned bookings
- [ ] Freelancer sees limited sidebar
- [ ] Freelancer can see event details but not pricing/contracts
- [ ] Freelancer can update their profile

## Analytics
- [ ] Revenue chart shows monthly data
- [ ] Funnel shows inquiry → intake → contract → booking
- [ ] Event type pie chart renders
- [ ] Top clients sorted by revenue

## Email Notifications
- [x] Inquiry submitted → email to studio owner
- [x] Contract sent → email to client with signing link
- [x] Contract signed → email to studio owner
- [x] Contract signed → booking confirmation email to client

## Landing Page
- [x] Renders with hero, features, pricing, testimonials, CTA
- [x] Warm gradient theme
- [x] DM Sans font applied
- [ ] Responsive on mobile

---

## Test Coverage Summary
- **Total test cases:** 88
- **Manually verified:** 42
- **Not yet tested:** 46
- **Automated tests:** 0

> Automated tests to be added with Vitest/Playwright in next phase.
