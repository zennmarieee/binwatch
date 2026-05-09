-- ============================================================
-- BinWatch Database Schema
-- ============================================================
-- Run this entire file in Supabase SQL Editor to rebuild
-- the database from scratch.
-- ============================================================


-- ============================================================
-- STEP 1: DROP EXISTING TABLES (clean slate)
-- ============================================================
drop table if exists public.activity_logs;
drop table if exists public.student_points;
drop table if exists public.reports;
drop table if exists public.bins;


-- ============================================================
-- STEP 2: CREATE TABLES
-- ============================================================

-- BINS
create table public.bins (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location_name text not null,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'no_active_report'
    check (status in ('no_active_report', 'pending', 'in_progress', 'resolved')),
  is_active boolean not null default true,
  resolved_at timestamptz,
  created_at timestamptz default now()
);

-- REPORTS
create table public.reports (
  id uuid default gen_random_uuid() primary key,
  bin_id uuid not null references public.bins(id) on delete cascade,
  condition text not null
    check (condition in ('overflowing', 'almost_full', 'damaged')),
  student_id text,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'resolved')),
  assigned_to uuid,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- STUDENT POINTS
create table public.student_points (
  id uuid default gen_random_uuid() primary key,
  student_id text not null unique,
  total_points integer not null default 0,
  report_count integer not null default 0,
  last_activity timestamptz default now(),
  created_at timestamptz default now()
);

-- ACTIVITY LOGS
create table public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  report_id uuid references public.reports(id) on delete cascade,
  bin_id uuid references public.bins(id) on delete cascade,
  action text not null,
  performed_by uuid,
  notes text,
  created_at timestamptz default now()
);


-- ============================================================
-- STEP 3: INDEXES
-- ============================================================
create index on public.reports(bin_id);
create index on public.reports(status);
create index on public.student_points(student_id);
create index on public.activity_logs(report_id);
create index on public.activity_logs(bin_id);


-- ============================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================================
alter table public.bins enable row level security;
alter table public.reports enable row level security;
alter table public.student_points enable row level security;
alter table public.activity_logs enable row level security;


-- ============================================================
-- STEP 5: GRANTS
-- ============================================================
grant usage on schema public to anon, authenticated;

grant select on public.bins to anon, authenticated;
grant select, insert on public.reports to anon, authenticated;
grant select, insert, update on public.student_points to anon, authenticated;
grant select on public.activity_logs to anon, authenticated;


-- ============================================================
-- STEP 6: RLS POLICIES
-- ============================================================

-- BINS
create policy "Public can view active bins"
on public.bins for select
using (is_active = true);

-- REPORTS
create policy "Public can view reports"
on public.reports for select
using (true);

create policy "Anyone can submit a report"
on public.reports for insert
with check (true);

-- STUDENT POINTS
create policy "Public can view student points"
on public.student_points for select
using (true);

create policy "Anyone can insert student points"
on public.student_points for insert
with check (true);

create policy "Anyone can update student points"
on public.student_points for update
using (true);

----

-- Allow authenticated users (staff/admin) to insert and update bins
grant insert, update on public.bins to authenticated;

-- Allow admin to manage bins
create policy "Authenticated users can insert bins"
on public.bins for insert
to authenticated
with check (true);

create policy "Authenticated users can update bins"
on public.bins for update
to authenticated
using (true);

----

alter table public.bins
add column qr_code text;