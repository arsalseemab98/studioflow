# StudioFlow — Test Plan & Status

## Status Legend
- [ ] Planned
- [x] Passing (manually verified)
- [!] Failing

---

## Auth
- [x] Login with valid credentials redirects to /dashboard
- [ ] Login with invalid credentials shows error
- [x] Signup creates user, profile, and organization
- [x] Unauthenticated users redirected from /dashboard to /login
- [ ] Logout clears session
- [ ] Freelancer login shows limited portal

## Multi-Tenancy
- [x] Each signup creates unique org with slug
- [x] RLS isolates data between organizations
- [x] Public forms show correct company branding
- [ ] Different companies can't see each other's data

## Inquiries
- [x] Public inquiry form submits successfully
- [x] Public form shows company branding
- [x] Inquiry creates client if not existing
- [x] Inquiry list shows all org inquiries with status icons
- [x] 🟠 New status with "Send Details Form" button
- [x] 🕐 Details Received status with "Send Contract" button
- [x] ✅ Booked status with "Complete" checkmark
- [x] 📦 Archived status
- [x] Pipeline: Inquiry → Details Form → Crew → Contract → Booked
- [x] Multi-day events (up to 5 days with name/date/hours)
- [x] Email to studio owner on new inquiry (company branded)
- [ ] Manual inquiry creation from dashboard

## Details Form
- [x] Send details form from inquiry detail page
- [x] Pick from available form templates
- [x] Generates shareable link (no line break)
- [x] Email sent to client with form link (company branded)
- [x] Sending marks inquiry as "contacted"
- [x] Re-send details form after initial send
- [x] Re-send doesn't change status
- [ ] Client fills form and data visible to studio
- [ ] Wedding Details Form template has 22 fields

## Crew
- [ ] Add team/external crew members
- [ ] Invite freelancer with portal access
- [ ] Assign crew to inquiry/booking
- [ ] Remove crew from booking

## Contracts
- [x] Create contract with pre-filled inquiry data
- [x] Template selection (Simple vs Photography Client Agreement)
- [x] Auto-fill fields from client/inquiry (read-only grey)
- [x] Price is manual entry only (orange, required)
- [x] Red warning + disabled button without price
- [x] Fields re-fill when client changes
- [x] Send contract emails client (company branded)
- [x] Signing link clickable with copy + open buttons
- [x] Client signs digitally with signature pad
- [x] Auto-creates confirmed booking with correct price/date/location
- [x] Signing emails owner (company branded)
- [x] Signing emails client booking confirmation (company branded)

## Bookings
- [x] Auto-booking has correct title, price, date, location
- [x] Bookings scoped to organization
- [ ] Create booking manually
- [ ] Calendar shows bookings
- [ ] Double-booking prevention
- [ ] Booking shows assigned crew

## Dashboard
- [x] Stats: bookings, inquiries, contracts, revenue all correct
- [x] Upcoming bookings + recent inquiries lists
- [x] Share Inquiry Form card with copy + email

## Email System
- [x] All 5 emails use company name in FROM
- [x] All emails use company brand color in gradients
- [x] All emails show company footer (email, phone, website, address)
- [x] All emails show "Powered by StudioFlow"
- [x] Inquiry received → owner email
- [x] Details form sent → client email with link
- [x] Contract sent → client email with signing link
- [x] Contract signed → owner notification
- [x] Contract signed → client booking confirmation

## Freelancer Portal
- [ ] Limited dashboard with only assigned bookings
- [ ] Limited sidebar (My Bookings + Settings)

## Analytics / Recommendations / Settings
- [ ] Revenue chart, funnel, event types, top clients
- [ ] Location/pose recommendations
- [ ] Company settings with brand color

## Landing Page
- [x] Warm gradient theme, DM Sans, hero, features, pricing, testimonials

---

## Summary
- **Total:** 90 test cases
- **Verified:** 48
- **Remaining:** 42
- **Automated:** 0
