-- Crew members table
create table crew_members (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null,
  name text not null,
  email text,
  phone text,
  role text not null default 'photographer' check (role in ('photographer', 'videographer', 'assistant', 'other')),
  type text not null default 'team' check (type in ('team', 'external')),
  notes text,
  created_at timestamptz default now()
);

-- Booking assignments table
create table booking_assignments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade not null,
  crew_member_id uuid references crew_members(id) on delete cascade not null,
  role text not null check (role in ('photographer', 'videographer', 'assistant', 'other')),
  notes text,
  created_at timestamptz default now(),
  unique(booking_id, crew_member_id)
);

-- Update org_members role to include freelancer
alter table org_members drop constraint if exists org_members_role_check;
alter table org_members add constraint org_members_role_check check (role in ('owner', 'admin', 'member', 'freelancer'));

-- Indexes
create index idx_crew_members_org on crew_members(org_id);
create index idx_crew_members_user on crew_members(user_id);
create index idx_booking_assignments_booking on booking_assignments(booking_id);
create index idx_booking_assignments_crew on booking_assignments(crew_member_id);

-- RLS
alter table crew_members enable row level security;
alter table booking_assignments enable row level security;

-- Crew member policies
create policy "Org members can view crew" on crew_members for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org admins can insert crew" on crew_members for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org admins can update crew" on crew_members for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org admins can delete crew" on crew_members for delete
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Booking assignment policies
create policy "Org members can view assignments" on booking_assignments for select
  using (booking_id in (select id from bookings where org_id in (select org_id from org_members where user_id = auth.uid())));
create policy "Org members can insert assignments" on booking_assignments for insert
  with check (booking_id in (select id from bookings where org_id in (select org_id from org_members where user_id = auth.uid())));
create policy "Org members can delete assignments" on booking_assignments for delete
  using (booking_id in (select id from bookings where org_id in (select org_id from org_members where user_id = auth.uid())));

-- Freelancer policies
create policy "Freelancers can view assigned bookings" on bookings for select
  using (
    id in (
      select ba.booking_id from booking_assignments ba
      join crew_members cm on cm.id = ba.crew_member_id
      where cm.user_id = auth.uid()
    )
  );
create policy "Freelancers can view own crew profile" on crew_members for select
  using (user_id = auth.uid());
create policy "Freelancers can view own assignments" on booking_assignments for select
  using (crew_member_id in (select id from crew_members where user_id = auth.uid()));
