-- =========================================================================
-- LIVE CLASSES SCHEMA & ACCESS POLICIES
-- =========================================================================

create table if not exists public.live_classes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  course_id text references public.courses(id) on delete set null,
  description text,
  teacher_name text not null default 'Parvesh Kumar',
  google_meet_url text not null,
  scheduled_date date not null default current_date,
  start_time time not null default '18:00',
  end_time time not null default '19:30',
  status text not null default 'Upcoming' check (status in ('Upcoming', 'Live Now', 'Completed', 'Cancelled')),
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.live_classes enable row level security;

-- Admin policies
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'live_classes' and policyname = 'Admins can manage live classes') then
    create policy "Admins can manage live classes" on public.live_classes for all using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'live_classes' and policyname = 'Published live classes viewable by all') then
    create policy "Published live classes viewable by all" on public.live_classes for select using (is_published = true or public.is_admin());
  end if;
end $$;

-- Index for performance
create index if not exists idx_live_classes_published on public.live_classes(is_published, scheduled_date);

-- Seed an initial Live Class connected to Class 12 if table is empty
insert into public.live_classes (
  id,
  title,
  course_id,
  description,
  teacher_name,
  google_meet_url,
  scheduled_date,
  start_time,
  end_time,
  status,
  is_published
)
select
  '11111111-2222-3333-4444-555555555555'::uuid,
  'Live Doubt & Numerical Masterclass: Partnership Accounts',
  'class-12',
  'Exclusive interactive problem-solving session covering tricky adjustments in Admission & Retirement of Partners, followed by live Q&A.',
  'Parvesh Kumar',
  'https://meet.google.com/abc-defg-hij',
  current_date + interval '1 day',
  '18:00'::time,
  '19:30'::time,
  'Upcoming',
  true
where not exists (select 1 from public.live_classes limit 1);
