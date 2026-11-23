-- =========================================================================
-- PRIME COMMERCE HUB — UNIFIED DATABASE SCHEMA
-- =========================================================================
-- Use this script or the migration files in supabase/migrations/
-- Run in your Supabase Dashboard -> SQL Editor -> Run
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student' check (role in ('student', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Public profiles viewable by everyone') then
    create policy "Public profiles viewable by everyone" on public.profiles for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'profiles' and policyname = 'Users can update their own profile') then
    create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
  end if;
end $$;

-- 2. User Roles Table
create table if not exists public.user_roles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_roles enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'user_roles' and policyname = 'Users view own role or admin') then
    create policy "Users view own role or admin" on public.user_roles for select using (auth.uid() = user_id or exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
  end if;
end $$;

create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid()
      and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Auto-register user trigger
create or replace function public.handle_user_auth_sync()
returns trigger as $$
declare
  assigned_role text := 'student';
begin
  if lower(new.email) in ('parveshdhiman1900@gmail.com', 'akshit2046@gmail.com') then
    assigned_role := 'admin';
  end if;

  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    assigned_role
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    role = case when lower(excluded.email) in ('parveshdhiman1900@gmail.com', 'akshit2046@gmail.com') then 'admin' else profiles.role end,
    updated_at = now();

  insert into public.user_roles (user_id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    assigned_role
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, user_roles.full_name),
    role = case when lower(excluded.email) in ('parveshdhiman1900@gmail.com', 'akshit2046@gmail.com') then 'admin' else user_roles.role end,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_sync on auth.users;
create trigger on_auth_user_created_sync
  after insert on auth.users
  for each row execute procedure public.handle_user_auth_sync();

-- 3. Courses Table
create table if not exists public.courses (
  id text primary key,
  title text not null,
  slug text,
  category text not null default 'Class 12 Commerce',
  badge text default 'BOARD EXCELLENCE',
  description text,
  teacher_name text not null default 'Parvesh Kumar',
  instructor_name text default 'Parvesh Kumar',
  subject text not null default 'Accountancy',
  thumbnail_key text,
  thumbnail_object_key text,
  price numeric not null default 0,
  original_price numeric,
  discounted_price numeric,
  class_level text default 'Class 12',
  duration text default '60+ Hours',
  language text default 'Hinglish',
  status text default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  is_published boolean not null default true,
  mode text default 'Online Interactive & Self-Paced',
  topics text[] default array[]::text[],
  highlights text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'courses' and policyname = 'Public courses viewable by all if published') then
    create policy "Public courses viewable by all if published" on public.courses for select using (is_published = true or status = 'PUBLISHED' or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'courses' and policyname = 'Admins can manage courses') then
    create policy "Admins can manage courses" on public.courses for all using (public.is_admin());
  end if;
end $$;

-- 4. Course Modules Table
create table if not exists public.course_modules (
  id uuid default gen_random_uuid() primary key,
  course_id text references public.courses(id) on delete cascade not null,
  title text not null,
  description text,
  position integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.course_modules enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'course_modules' and policyname = 'Modules viewable by all') then
    create policy "Modules viewable by all" on public.course_modules for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'course_modules' and policyname = 'Admins can manage modules') then
    create policy "Admins can manage modules" on public.course_modules for all using (public.is_admin());
  end if;
end $$;

-- 5. Lectures Table
create table if not exists public.lectures (
  id uuid default gen_random_uuid() primary key,
  course_id text references public.courses(id) on delete set null,
  module_id uuid references public.course_modules(id) on delete set null,
  title text not null,
  chapter text,
  lecture_number text,
  description text,
  teacher_name text not null default 'Parvesh Kumar',
  subject text not null default 'Accountancy',
  video_key text,
  video_object_key text,
  thumbnail_key text,
  duration text default '45 mins',
  position integer not null default 0,
  is_preview boolean not null default false,
  access_type text not null default 'paid' check (access_type in ('free', 'paid')),
  price numeric not null default 0,
  status text default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED')),
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lectures enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'lectures' and policyname = 'Lectures metadata viewable if published or admin') then
    create policy "Lectures metadata viewable if published or admin" on public.lectures for select using (is_published = true or status = 'PUBLISHED' or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'lectures' and policyname = 'Admins can manage lectures') then
    create policy "Admins can manage lectures" on public.lectures for all using (public.is_admin());
  end if;
end $$;

-- 6. Lecture Resources Table
create table if not exists public.lecture_resources (
  id uuid default gen_random_uuid() primary key,
  lecture_id uuid references public.lectures(id) on delete cascade,
  course_id text references public.courses(id) on delete cascade,
  title text not null,
  object_key text not null,
  file_type text not null default 'pdf',
  file_size integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lecture_resources enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'lecture_resources' and policyname = 'Resources viewable by authenticated or admin') then
    create policy "Resources viewable by authenticated or admin" on public.lecture_resources for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'lecture_resources' and policyname = 'Admins can manage lecture resources') then
    create policy "Admins can manage lecture resources" on public.lecture_resources for all using (public.is_admin());
  end if;
end $$;

-- 7. Enrollments Table
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  payment_id uuid,
  status text not null default 'active' check (status in ('active', 'revoked')),
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, course_id)
);

alter table public.enrollments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'enrollments' and policyname = 'Students view own enrollments') then
    create policy "Students view own enrollments" on public.enrollments for select using (auth.uid() = student_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'enrollments' and policyname = 'Admins can manage enrollments') then
    create policy "Admins can manage enrollments" on public.enrollments for all using (public.is_admin());
  end if;
end $$;

-- 8. Payments Table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id text references public.courses(id) on delete set null,
  gateway_order_id text,
  gateway_payment_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric not null,
  currency text not null default 'INR',
  payment_status text not null default 'pending',
  status text default 'PENDING' check (status in ('CREATED', 'PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED')),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'Students view own payments') then
    create policy "Students view own payments" on public.payments for select using (auth.uid() = student_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'Admins can manage payments') then
    create policy "Admins can manage payments" on public.payments for all using (public.is_admin());
  end if;
end $$;

-- 9. Purchases Table (legacy compatibility)
create table if not exists public.purchases (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  course_id text references public.courses(id) on delete cascade,
  lecture_id uuid references public.lectures(id) on delete cascade,
  amount numeric not null,
  payment_status text not null default 'completed' check (payment_status in ('completed', 'pending', 'failed', 'refunded')),
  transaction_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_item_provided check (course_id is not null or lecture_id is not null)
);

alter table public.purchases enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'purchases' and policyname = 'Students can view their own purchases') then
    create policy "Students can view their own purchases" on public.purchases for select using (auth.uid() = student_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'purchases' and policyname = 'Admins can manage purchases') then
    create policy "Admins can manage purchases" on public.purchases for all using (public.is_admin());
  end if;
end $$;

-- 10. Lecture Progress Table
create table if not exists public.lecture_progress (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  lecture_id uuid references public.lectures(id) on delete cascade not null,
  last_position_seconds numeric not null default 0,
  completed boolean not null default false,
  last_watched_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, lecture_id)
);

alter table public.lecture_progress enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'lecture_progress' and policyname = 'Students view and update own progress') then
    create policy "Students view and update own progress" on public.lecture_progress for select using (auth.uid() = student_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'lecture_progress' and policyname = 'Students can insert own progress') then
    create policy "Students can insert own progress" on public.lecture_progress for insert with check (auth.uid() = student_id);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'lecture_progress' and policyname = 'Students can update own progress') then
    create policy "Students can update own progress" on public.lecture_progress for update using (auth.uid() = student_id);
  end if;
end $$;

-- 11. Webhook Events Table
create table if not exists public.webhook_events (
  id uuid default gen_random_uuid() primary key,
  provider text not null default 'razorpay',
  event_id text not null,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  processed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (provider, event_id)
);

alter table public.webhook_events enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'webhook_events' and policyname = 'Only admins can view webhook events') then
    create policy "Only admins can view webhook events" on public.webhook_events for select using (public.is_admin());
  end if;
end $$;

-- 12. Email Logs Table
create table if not exists public.email_logs (
  id uuid default gen_random_uuid() primary key,
  recipient text not null,
  template_type text not null,
  related_entity_id text,
  provider_message_id text,
  status text not null default 'sent',
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  sent_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.email_logs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'email_logs' and policyname = 'Only admins can view email logs') then
    create policy "Only admins can view email logs" on public.email_logs for select using (public.is_admin());
  end if;
end $$;

-- 13. Admin Audit Logs Table
create table if not exists public.admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.admin_audit_logs enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'admin_audit_logs' and policyname = 'Only admins can view audit logs') then
    create policy "Only admins can view audit logs" on public.admin_audit_logs for select using (public.is_admin());
  end if;
end $$;
