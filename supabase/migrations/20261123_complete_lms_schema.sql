-- =========================================================================
-- PRIME COMMERCE HUB — COMPLETE LMS & EXTENDED PRODUCTION SCHEMA
-- =========================================================================
-- Migration: 20261123_complete_lms_schema.sql
-- Idempotent script: Safe to run on existing or fresh Supabase database.
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Mirrors Auth Users with Role & Metadata)
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 2. USER ROLES TABLE (Admin authorization mapping)
-- -------------------------------------------------------------------------
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

-- Helper function: is_admin
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

-- Trigger to auto-create profile & role on signup
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

-- -------------------------------------------------------------------------
-- 3. COURSES TABLE & EXTENSIONS
-- -------------------------------------------------------------------------
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

-- Ensure all required columns exist if courses table was created previously
do $$ begin
  alter table public.courses add column if not exists slug text;
  alter table public.courses add column if not exists instructor_name text default 'Parvesh Kumar';
  alter table public.courses add column if not exists thumbnail_object_key text;
  alter table public.courses add column if not exists discounted_price numeric;
  alter table public.courses add column if not exists class_level text default 'Class 12';
  alter table public.courses add column if not exists duration text default '60+ Hours';
  alter table public.courses add column if not exists language text default 'Hinglish';
  alter table public.courses add column if not exists status text default 'PUBLISHED';
end $$;

-- Populate slug and aliases if null
update public.courses set slug = id where slug is null;
update public.courses set instructor_name = teacher_name where instructor_name is null;
update public.courses set thumbnail_object_key = thumbnail_key where thumbnail_object_key is null and thumbnail_key is not null;
update public.courses set discounted_price = price where discounted_price is null;

alter table public.courses enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'courses' and policyname = 'Public courses viewable by all if published') then
    create policy "Public courses viewable by all if published" on public.courses for select using (is_published = true or status = 'PUBLISHED' or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'courses' and policyname = 'Admins can manage courses') then
    create policy "Admins can manage courses" on public.courses for all using (public.is_admin());
  end if;
end $$;

-- -------------------------------------------------------------------------
-- 4. COURSE MODULES TABLE
-- -------------------------------------------------------------------------
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

create index if exit_idx_modules_course on public.course_modules(course_id, position);

-- -------------------------------------------------------------------------
-- 5. LECTURES TABLE & EXTENSIONS
-- -------------------------------------------------------------------------
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

do $$ begin
  alter table public.lectures add column if not exists module_id uuid references public.course_modules(id) on delete set null;
  alter table public.lectures add column if not exists video_object_key text;
  alter table public.lectures add column if not exists position integer not null default 0;
  alter table public.lectures add column if not exists is_preview boolean not null default false;
  alter table public.lectures add column if not exists status text default 'PUBLISHED';
end $$;

-- Keep video_key and video_object_key in sync
update public.lectures set video_object_key = video_key where video_object_key is null and video_key is not null;
update public.lectures set video_key = video_object_key where video_key is null and video_object_key is not null;
update public.lectures set is_preview = true where access_type = 'free';

alter table public.lectures enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'lectures' and policyname = 'Lectures metadata viewable if published or admin') then
    create policy "Lectures metadata viewable if published or admin" on public.lectures for select using (is_published = true or status = 'PUBLISHED' or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'lectures' and policyname = 'Admins can manage lectures') then
    create policy "Admins can manage lectures" on public.lectures for all using (public.is_admin());
  end if;
end $$;

create index if not exists idx_lectures_module on public.lectures(module_id, position);
create index if not exists idx_lectures_course on public.lectures(course_id, position);

-- -------------------------------------------------------------------------
-- 6. LECTURE RESOURCES TABLE
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 7. ENROLLMENTS TABLE (Student Course Access)
-- -------------------------------------------------------------------------
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

create index if not exists idx_enrollments_student on public.enrollments(student_id);
create index if not exists idx_enrollments_course on public.enrollments(course_id);

-- -------------------------------------------------------------------------
-- 8. PAYMENTS TABLE & EXTENSIONS
-- -------------------------------------------------------------------------
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

do $$ begin
  alter table public.payments add column if not exists course_id text references public.courses(id) on delete set null;
  alter table public.payments add column if not exists razorpay_order_id text;
  alter table public.payments add column if not exists razorpay_payment_id text;
  alter table public.payments add column if not exists status text default 'PENDING';
  alter table public.payments add column if not exists verified_at timestamp with time zone;
  alter table public.payments add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
end $$;

-- Keep gateway_order_id and razorpay_order_id aligned
update public.payments set razorpay_order_id = gateway_order_id where razorpay_order_id is null and gateway_order_id is not null;
update public.payments set razorpay_payment_id = gateway_payment_id where razorpay_payment_id is null and gateway_payment_id is not null;

alter table public.payments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'Students view own payments') then
    create policy "Students view own payments" on public.payments for select using (auth.uid() = student_id or public.is_admin());
  end if;
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'Admins can manage payments') then
    create policy "Admins can manage payments" on public.payments for all using (public.is_admin());
  end if;
end $$;

-- -------------------------------------------------------------------------
-- 9. PURCHASES TABLE (Legacy & Granular Purchase Tracking)
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 10. LECTURE PROGRESS TABLE
-- -------------------------------------------------------------------------
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

create index if not exists idx_progress_student on public.lecture_progress(student_id);
create index if not exists idx_progress_lecture on public.lecture_progress(lecture_id);

-- -------------------------------------------------------------------------
-- 11. WEBHOOK EVENTS TABLE (Idempotency)
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 12. EMAIL LOGS TABLE (Deduplication & Audit)
-- -------------------------------------------------------------------------
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

create index if not exists idx_email_dedup on public.email_logs(recipient, template_type, related_entity_id);

-- -------------------------------------------------------------------------
-- 13. ADMIN AUDIT LOGS TABLE
-- -------------------------------------------------------------------------
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

-- -------------------------------------------------------------------------
-- 14. ACCESS VERIFICATION FUNCTIONS (Enrolments + Purchases + Previews)
-- -------------------------------------------------------------------------
create or replace function public.has_course_access(p_user_id uuid, p_course_id text)
returns boolean as $$
begin
  if p_user_id is null then
    return false;
  end if;

  if exists (select 1 from public.user_roles where user_id = p_user_id and role = 'admin') then
    return true;
  end if;

  if exists (select 1 from public.enrollments where student_id = p_user_id and course_id = p_course_id and status = 'active') then
    return true;
  end if;

  if exists (select 1 from public.purchases where student_id = p_user_id and course_id = p_course_id and payment_status = 'completed') then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;

create or replace function public.has_lecture_access(p_user_id uuid, p_lecture_id uuid)
returns boolean as $$
declare
  v_is_preview boolean;
  v_access_type text;
  v_course_id text;
begin
  select is_preview, access_type, course_id into v_is_preview, v_access_type, v_course_id
  from public.lectures
  where id = p_lecture_id;

  if not found then
    return false;
  end if;

  if v_is_preview = true or v_access_type = 'free' then
    return true;
  end if;

  if p_user_id is null then
    return false;
  end if;

  if exists (select 1 from public.user_roles where user_id = p_user_id and role = 'admin') then
    return true;
  end if;

  if v_course_id is not null and public.has_course_access(p_user_id, v_course_id) then
    return true;
  end if;

  if exists (select 1 from public.purchases where student_id = p_user_id and lecture_id = p_lecture_id and payment_status = 'completed') then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;

create or replace function public.has_resource_access(p_user_id uuid, p_resource_id uuid)
returns boolean as $$
declare
  v_access_type text;
  v_course_id text;
  v_lecture_id uuid;
begin
  select access_type, course_id, lecture_id into v_access_type, v_course_id, v_lecture_id
  from public.resources
  where id = p_resource_id;

  if not found then
    select 'paid', course_id, lecture_id into v_access_type, v_course_id, v_lecture_id
    from public.lecture_resources
    where id = p_resource_id;

    if not found then
      return false;
    end if;
  end if;

  if v_access_type = 'free' then
    return true;
  end if;

  if p_user_id is null then
    return false;
  end if;

  if exists (select 1 from public.user_roles where user_id = p_user_id and role = 'admin') then
    return true;
  end if;

  if v_course_id is not null and public.has_course_access(p_user_id, v_course_id) then
    return true;
  end if;

  if v_lecture_id is not null and public.has_lecture_access(p_user_id, v_lecture_id) then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;

-- -------------------------------------------------------------------------
-- 15. SEED COURSE MODULES & SAMPLE CURRICULUM
-- -------------------------------------------------------------------------
-- Class 11 Modules
insert into public.course_modules (id, course_id, title, description, position)
values
  ('11111111-0000-0000-0000-000000000001', 'class-11', 'Module 1: Accounting Foundations & Basic Principles', 'Understanding basic accounting terms, GAAP, and accounting equations.', 1),
  ('11111111-0000-0000-0000-000000000002', 'class-11', 'Module 2: Journal Entries & Subsidiary Books', 'Mastering the golden rules of accounting and recording daily business transactions.', 2),
  ('11111111-0000-0000-0000-000000000003', 'class-11', 'Module 3: Bank Reconciliation & Trial Balance', 'BRS preparation, ledger balancing, and trial balance error detection.', 3),
  ('11111111-0000-0000-0000-000000000004', 'class-11', 'Module 4: Financial Statements & Final Accounts', 'Trading, Profit & Loss Account, and Balance Sheet with adjustments.', 4)
on conflict (id) do nothing;

-- Class 12 Modules
insert into public.course_modules (id, course_id, title, description, position)
values
  ('12121212-0000-0000-0000-000000000001', 'class-12', 'Module 1: Partnership Fundamentals & Valuation of Goodwill', 'Partnership deed provisions, P&L Appropriation, and Goodwill calculation.', 1),
  ('12121212-0000-0000-0000-000000000002', 'class-12', 'Module 2: Reconstitution & Dissolution of Partnership', 'Admission, retirement, death of partners, and firm realization accounts.', 2),
  ('12121212-0000-0000-0000-000000000003', 'class-12', 'Module 3: Accounting for Share Capital & Debentures', 'Pro-rata share allotment, calls-in-arrears, share forfeiture, and debentures.', 3),
  ('12121212-0000-0000-0000-000000000004', 'class-12', 'Module 4: Financial Analysis & Cash Flow Statement', 'Ratio analysis and 8-mark Cash Flow Statement as per AS-3 Revised.', 4)
on conflict (id) do nothing;

-- Seed Sample Lectures for Class 11
insert into public.lectures (id, course_id, module_id, title, chapter, lecture_number, description, duration, position, is_preview, access_type, price, status, is_published, video_object_key)
values
  (
    '21111111-0000-0000-0000-000000000001',
    'class-11',
    '11111111-0000-0000-0000-000000000001',
    'Lecture 1: The Modern & Traditional Rules of Debit & Credit',
    'Basic Accounting Concepts',
    '01',
    'Introduction to dual aspect concept, classifying transactions into Personal, Real, Nominal, and modern Asset/Liability/Capital frameworks.',
    '42 mins',
    1,
    true,
    'free',
    0,
    'PUBLISHED',
    true,
    'recordings/accountancy/class11-lecture1-debit-credit.mp4'
  ),
  (
    '21111111-0000-0000-0000-000000000002',
    'class-11',
    '11111111-0000-0000-0000-000000000001',
    'Lecture 2: The Accounting Equation Simplified',
    'Basic Accounting Concepts',
    '02',
    'Assets = Liabilities + Capital in real-life business transaction analysis with practical ledger examples.',
    '48 mins',
    2,
    false,
    'paid',
    499,
    'PUBLISHED',
    true,
    'recordings/accountancy/class11-lecture2-accounting-equation.mp4'
  ),
  (
    '21111111-0000-0000-0000-000000000003',
    'class-11',
    '11111111-0000-0000-0000-000000000002',
    'Lecture 3: Master Class in Journal Entries & Narration',
    'Journal & Ledger',
    '03',
    'Trade discount vs Cash discount, opening entries, compound entries, and bad debts treatment.',
    '54 mins',
    1,
    false,
    'paid',
    499,
    'PUBLISHED',
    true,
    'recordings/accountancy/class11-lecture3-journal-entries.mp4'
  ),
  (
    '21111111-0000-0000-0000-000000000004',
    'class-11',
    '11111111-0000-0000-0000-000000000003',
    'Lecture 4: Bank Reconciliation Statement (BRS) Complete Technique',
    'Bank Reconciliation',
    '04',
    'Overdraft balance handling, timing differences, cheques deposited but not credited, and amended cash book.',
    '50 mins',
    1,
    false,
    'paid',
    499,
    'PUBLISHED',
    true,
    'recordings/accountancy/class11-lecture4-brs.mp4'
  )
on conflict (id) do nothing;

-- Seed Sample Lectures for Class 12
insert into public.lectures (id, course_id, module_id, title, chapter, lecture_number, description, duration, position, is_preview, access_type, price, status, is_published, video_object_key)
values
  (
    '22121212-0000-0000-0000-000000000001',
    'class-12',
    '12121212-0000-0000-0000-000000000001',
    'Lecture 1: Partnership Fundamentals — P&L Appropriation Masterclass',
    'Partnership Fundamentals',
    '01',
    'Comprehensive breakdown of Interest on Capital, Interest on Drawings (Average Period Method), and Partners Commission.',
    '58 mins',
    1,
    true,
    'free',
    0,
    'PUBLISHED',
    true,
    'recordings/accountancy/class12-lecture1-pl-appropriation.mp4'
  ),
  (
    '22121212-0000-0000-0000-000000000002',
    'class-12',
    '12121212-0000-0000-0000-000000000001',
    'Lecture 2: Past Adjustments & Guarantee of Profits',
    'Partnership Fundamentals',
    '02',
    'Single adjustment journal entry techniques and minimum profit guarantee scenarios for 6-mark board exam questions.',
    '62 mins',
    2,
    false,
    'paid',
    599,
    'PUBLISHED',
    true,
    'recordings/accountancy/class12-lecture2-past-adjustments.mp4'
  ),
  (
    '22121212-0000-0000-0000-000000000003',
    'class-12',
    '12121212-0000-0000-0000-000000000003',
    'Lecture 3: Pro-Rata Allotment & Share Forfeiture Drill',
    'Company Accounts',
    '03',
    'Pro-rata category table structure, surplus application money adjustment, and capital reserve calculation upon reissue.',
    '65 mins',
    1,
    false,
    'paid',
    599,
    'PUBLISHED',
    true,
    'recordings/accountancy/class12-lecture3-prorata-allotment.mp4'
  ),
  (
    '22121212-0000-0000-0000-000000000004',
    'class-12',
    '12121212-0000-0000-0000-000000000004',
    'Lecture 4: Cash Flow Statement (AS-3 Revised) Master Blueprint',
    'Financial Statement Analysis',
    '04',
    'Full board-pattern numerical solving for Operating, Investing, and Financing activities with provision for taxation.',
    '70 mins',
    1,
    false,
    'paid',
    599,
    'PUBLISHED',
    true,
    'recordings/accountancy/class12-lecture4-cashflow-statement.mp4'
  )
on conflict (id) do nothing;
