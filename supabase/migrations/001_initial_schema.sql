-- StudioFlow Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- Organizations
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz default now()
);

-- User profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamptz default now()
);

-- Org members
create table org_members (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz default now(),
  unique(org_id, user_id)
);

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now()
);

-- Inquiries
create table inquiries (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  event_type text not null,
  event_date date,
  location text,
  budget numeric,
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'archived')),
  source_url text,
  created_at timestamptz default now()
);

-- Intake form templates
create table intake_forms (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  fields jsonb not null default '[]',
  created_at timestamptz default now()
);

-- Intake responses
create table intake_responses (
  id uuid primary key default uuid_generate_v4(),
  form_id uuid references intake_forms(id) on delete cascade not null,
  inquiry_id uuid references inquiries(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  answers jsonb not null default '{}',
  access_token uuid unique default uuid_generate_v4(),
  submitted_at timestamptz
);

-- Contract templates
create table contract_templates (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  content jsonb not null default '[]',
  category text,
  custom_fields jsonb default '[]',
  created_at timestamptz default now()
);

-- Contracts
create table contracts (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  template_id uuid references contract_templates(id) on delete set null,
  client_id uuid references clients(id) on delete set null not null,
  inquiry_id uuid references inquiries(id) on delete set null,
  content jsonb not null default '[]',
  status text not null default 'draft' check (status in ('draft', 'sent', 'viewed', 'signed', 'expired')),
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signature_data text,
  pdf_url text,
  access_token uuid unique default uuid_generate_v4(),
  created_at timestamptz default now()
);

-- Bookings
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null not null,
  contract_id uuid references contracts(id) on delete set null,
  inquiry_id uuid references inquiries(id) on delete set null,
  title text not null,
  event_type text,
  event_date date not null,
  start_time timestamptz,
  end_time timestamptz,
  location text,
  status text not null default 'tentative' check (status in ('tentative', 'confirmed', 'completed', 'cancelled')),
  notes text,
  total_price numeric default 0,
  created_at timestamptz default now()
);

-- Workflow logs
create table workflow_logs (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade not null,
  inquiry_id uuid references inquiries(id) on delete cascade,
  action text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Recommendations
create table recommendations (
  id uuid primary key default uuid_generate_v4(),
  category text not null check (category in ('location', 'pose')),
  event_type text not null,
  title text not null,
  description text,
  image_url text,
  location_data jsonb default '{}'
);

-- Indexes
create index idx_org_members_org on org_members(org_id);
create index idx_org_members_user on org_members(user_id);
create index idx_clients_org on clients(org_id);
create index idx_inquiries_org on inquiries(org_id);
create index idx_inquiries_status on inquiries(status);
create index idx_bookings_org on bookings(org_id);
create index idx_bookings_date on bookings(event_date);
create index idx_contracts_org on contracts(org_id);
create index idx_contracts_status on contracts(status);
create index idx_contracts_token on contracts(access_token);
create index idx_intake_responses_token on intake_responses(access_token);

-- RLS
alter table organizations enable row level security;
alter table profiles enable row level security;
alter table org_members enable row level security;
alter table clients enable row level security;
alter table inquiries enable row level security;
alter table intake_forms enable row level security;
alter table intake_responses enable row level security;
alter table contract_templates enable row level security;
alter table contracts enable row level security;
alter table bookings enable row level security;
alter table workflow_logs enable row level security;
alter table recommendations enable row level security;

-- Profile policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Org policies
create policy "Members can view own org" on organizations for select
  using (id in (select org_id from org_members where user_id = auth.uid()));
create policy "Owners can update org" on organizations for update
  using (id in (select org_id from org_members where user_id = auth.uid() and role = 'owner'));

create policy "Org members can view members" on org_members for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Owners can manage members" on org_members for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid() and role in ('owner', 'admin')));
create policy "Owners can delete members" on org_members for delete
  using (org_id in (select org_id from org_members where user_id = auth.uid() and role in ('owner', 'admin')));

-- Client policies
create policy "Org members can view clients" on clients for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert clients" on clients for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update clients" on clients for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can delete clients" on clients for delete
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Inquiry policies
create policy "Org members can view inquiries" on inquiries for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert inquiries" on inquiries for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update inquiries" on inquiries for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Intake form policies
create policy "Org members can view intake_forms" on intake_forms for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert intake_forms" on intake_forms for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update intake_forms" on intake_forms for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can delete intake_forms" on intake_forms for delete
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Intake response policies
create policy "Org members can view responses" on intake_responses for select
  using (form_id in (select id from intake_forms where org_id in (select org_id from org_members where user_id = auth.uid())));

-- Contract template policies
create policy "Org members can view contract_templates" on contract_templates for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert contract_templates" on contract_templates for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update contract_templates" on contract_templates for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can delete contract_templates" on contract_templates for delete
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Contract policies
create policy "Org members can view contracts" on contracts for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert contracts" on contracts for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update contracts" on contracts for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Booking policies
create policy "Org members can view bookings" on bookings for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert bookings" on bookings for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can update bookings" on bookings for update
  using (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Workflow log policies
create policy "Org members can view workflow_logs" on workflow_logs for select
  using (org_id in (select org_id from org_members where user_id = auth.uid()));
create policy "Org members can insert workflow_logs" on workflow_logs for insert
  with check (org_id in (select org_id from org_members where user_id = auth.uid()));

-- Recommendation policies (public read)
create policy "Anyone can view recommendations" on recommendations for select using (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-create org on signup
create or replace function public.handle_new_org()
returns trigger as $$
declare
  new_org_id uuid;
begin
  insert into organizations (name, slug)
  values (
    coalesce(new.raw_user_meta_data->>'company_name', new.email),
    replace(lower(coalesce(new.raw_user_meta_data->>'company_name', split_part(new.email, '@', 1))), ' ', '-') || '-' || substr(new.id::text, 1, 8)
  )
  returning id into new_org_id;

  insert into org_members (org_id, user_id, role)
  values (new_org_id, new.id, 'owner');

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_org
  after insert on auth.users
  for each row execute procedure public.handle_new_org();

-- Seed recommendations
insert into recommendations (category, event_type, title, description) values
  ('location', 'wedding', 'Golden Hour Beach', 'Stunning sunset shots on sandy beaches with warm golden tones'),
  ('location', 'wedding', 'Garden Estate', 'Lush green gardens with elegant architecture as backdrop'),
  ('location', 'wedding', 'Urban Rooftop', 'City skyline views for modern, sophisticated wedding photos'),
  ('location', 'portrait', 'Downtown Alley', 'Gritty urban textures and graffiti for edgy portrait sessions'),
  ('location', 'portrait', 'Botanical Garden', 'Natural light filtering through trees for soft, organic portraits'),
  ('location', 'engagement', 'Vineyard', 'Rolling hills and grapevines for romantic engagement sessions'),
  ('location', 'engagement', 'Historic District', 'Cobblestone streets and vintage architecture for timeless photos'),
  ('location', 'corporate', 'Modern Office', 'Clean lines and professional settings for corporate headshots'),
  ('pose', 'wedding', 'First Look', 'Capture the emotional moment when partners see each other for the first time'),
  ('pose', 'wedding', 'Veil Shot', 'Wind-blown veil creating dramatic silhouette against the sky'),
  ('pose', 'wedding', 'Forehead Kiss', 'Intimate and tender moment between partners'),
  ('pose', 'portrait', 'Over the Shoulder', 'Classic portrait angle with natural expression'),
  ('pose', 'portrait', 'Walking Away', 'Candid movement shot for lifestyle portraits'),
  ('pose', 'engagement', 'Piggyback', 'Fun and playful pose showing the couple''s personality'),
  ('pose', 'engagement', 'Holding Hands Walk', 'Natural walking pose with genuine interaction');
