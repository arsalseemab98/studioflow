# Client Booking Pipeline — Design

**Date:** 2026-04-01
**Status:** Approved

## Flow
1. Photographer shares form link → Client fills out (customizable per event type)
2. Photographer sees submission → Assigns photographer + videographer (team or freelancer)
3. Photographer sets price → Sends contract to client
4. Client signs digitally → Booking auto-created with crew + price
5. Freelancers log in → See their assigned bookings only

## Database Changes
- New table: `crew_members` (name, email, phone, role, type)
- New table: `booking_assignments` (booking_id, crew_member_id, role)
- Update `org_members.role` check: add 'freelancer'
- RLS for freelancers: only see bookings they're assigned to

## Pages
- New: `/dashboard/crew` — crew roster management
- Enhanced: `/dashboard/inquiries/[id]` — assign crew + send contract
- Enhanced: `/dashboard/contracts/new` — pre-fill from inquiry + price
- Enhanced: `/dashboard/bookings/[id]` — show assigned crew
- New: Freelancer dashboard (role-based, limited view)
