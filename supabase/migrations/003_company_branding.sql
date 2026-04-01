alter table organizations add column if not exists description text;
alter table organizations add column if not exists website text;
alter table organizations add column if not exists email text;
alter table organizations add column if not exists phone text;
alter table organizations add column if not exists address text;
alter table organizations add column if not exists primary_color text default '#f97316';
alter table organizations add column if not exists industry text default 'photography';
