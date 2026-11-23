-- =========================================================================
-- PRIME COMMERCE HUB — COMPLETE LMS & TEACHER CONTENT MANAGEMENT SCHEMA
-- =========================================================================
-- Run this migration in Supabase Dashboard -> SQL Editor -> Run
-- Handles:
--  1. user_roles (Admin vs Student) with security definer check
--  2. courses (Paid complete courses)
--  3. lectures (Free or Paid video classes)
--  4. resources (Free or Paid PDFs, notes, assignments)
--  5. purchases (Individual lecture & Course purchases with access inheritance)
--  6. payments (Razorpay transactions & status tracking)
--  7. Row Level Security (RLS) & Access Functions
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. USER ROLES TABLE
-- =========================================================================
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

-- Policies for user_roles
create policy "Anyone authenticated can view their own role"
  on public.user_roles for select
  using ( auth.uid() = user_id );

-- Security function to verify if current user is admin
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

-- Auto-register user into user_roles upon Google OAuth sign-in
create or replace function public.handle_user_role_creation()
returns trigger as $$
declare
  assigned_role text := 'student';
begin
  -- Automatically assign admin role if email matches the designated teacher/admin
  if lower(new.email) in ('parveshdhiman1900@gmail.com') then
    assigned_role := 'admin';
  end if;

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
    role = case
      when lower(excluded.email) in ('parveshdhiman1900@gmail.com') then 'admin'
      else user_roles.role
    end,
    updated_at = now();

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_assign_role on auth.users;
create trigger on_auth_user_created_assign_role
  after insert on auth.users
  for each row execute procedure public.handle_user_role_creation();


-- =========================================================================
-- 2. COURSES TABLE
-- =========================================================================
create table if not exists public.courses (
  id text primary key,
  title text not null,
  category text not null default 'Class 12 Commerce',
  badge text default 'BOARD EXCELLENCE',
  description text,
  teacher_name text not null default 'Parvesh Kumar',
  subject text not null default 'Accountancy',
  thumbnail_key text,
  price numeric not null default 0,
  original_price numeric,
  is_published boolean not null default true,
  mode text default 'Online Interactive & Self-Paced',
  topics text[] default array[]::text[],
  highlights text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Public courses viewable by all if published"
  on public.courses for select
  using ( is_published = true or public.is_admin() );

create policy "Admins can insert courses"
  on public.courses for insert
  with check ( public.is_admin() );

create policy "Admins can update courses"
  on public.courses for update
  using ( public.is_admin() );

create policy "Admins can delete courses"
  on public.courses for delete
  using ( public.is_admin() );


-- =========================================================================
-- 3. LECTURES TABLE
-- =========================================================================
create table if not exists public.lectures (
  id uuid default gen_random_uuid() primary key,
  course_id text references public.courses(id) on delete set null,
  title text not null,
  chapter text,
  lecture_number text,
  description text,
  teacher_name text not null default 'Parvesh Kumar',
  subject text not null default 'Accountancy',
  video_key text,          -- R2 object key (e.g. recordings/accountancy/...)
  thumbnail_key text,      -- R2 object key (e.g. thumbnails/...)
  duration text default '45 mins',
  access_type text not null default 'paid' check (access_type in ('free', 'paid')),
  price numeric not null default 0,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lectures enable row level security;

create policy "Lectures metadata viewable if published or admin"
  on public.lectures for select
  using ( is_published = true or public.is_admin() );

create policy "Admins can insert lectures"
  on public.lectures for insert
  with check ( public.is_admin() );

create policy "Admins can update lectures"
  on public.lectures for update
  using ( public.is_admin() );

create policy "Admins can delete lectures"
  on public.lectures for delete
  using ( public.is_admin() );


-- =========================================================================
-- 4. RESOURCES TABLE (PDF Notes, Assignments, Study Materials)
-- =========================================================================
create table if not exists public.resources (
  id uuid default gen_random_uuid() primary key,
  course_id text references public.courses(id) on delete set null,
  lecture_id uuid references public.lectures(id) on delete set null,
  title text not null,
  description text,
  file_key text not null,  -- R2 object key (e.g. notes/accountancy/...)
  file_type text not null default 'pdf' check (file_type in ('pdf', 'notes', 'assignment', 'other')),
  file_format text default 'PDF Document',
  category_label text default 'Accountancy Notes',
  access_type text not null default 'free' check (access_type in ('free', 'paid')),
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.resources enable row level security;

create policy "Resources metadata viewable if published or admin"
  on public.resources for select
  using ( is_published = true or public.is_admin() );

create policy "Admins can insert resources"
  on public.resources for insert
  with check ( public.is_admin() );

create policy "Admins can update resources"
  on public.resources for update
  using ( public.is_admin() );

create policy "Admins can delete resources"
  on public.resources for delete
  using ( public.is_admin() );


-- =========================================================================
-- 5. PURCHASES TABLE
-- =========================================================================
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

create policy "Students can view their own purchases"
  on public.purchases for select
  using ( auth.uid() = student_id or public.is_admin() );

create policy "Admins can manage purchases"
  on public.purchases for all
  using ( public.is_admin() );


-- =========================================================================
-- 6. PAYMENTS TABLE
-- =========================================================================
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  student_id uuid references auth.users(id) on delete cascade not null,
  gateway_order_id text unique not null,
  gateway_payment_id text,
  amount numeric not null,
  currency text not null default 'INR',
  payment_status text not null default 'pending' check (payment_status in ('pending', 'success', 'failed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Students can view their own payments"
  on public.payments for select
  using ( auth.uid() = student_id or public.is_admin() );


-- =========================================================================
-- 7. ACCESS INHERITANCE VERIFICATION FUNCTIONS
-- =========================================================================

-- Function to check if a student has access to a lecture
create or replace function public.has_lecture_access(p_user_id uuid, p_lecture_id uuid)
returns boolean as $$
declare
  v_access_type text;
  v_course_id text;
  v_has_access boolean := false;
begin
  -- 1. Check if user is admin
  if exists (select 1 from public.user_roles where user_id = p_user_id and role = 'admin') then
    return true;
  end if;

  -- 2. Check if lecture exists and access type
  select access_type, course_id into v_access_type, v_course_id
  from public.lectures
  where id = p_lecture_id;

  if not found then
    return false;
  end if;

  -- 3. Free lectures are accessible to all
  if v_access_type = 'free' then
    return true;
  end if;

  -- 4. Check if student directly purchased this lecture
  if exists (
    select 1 from public.purchases
    where student_id = p_user_id
      and lecture_id = p_lecture_id
      and payment_status = 'completed'
  ) then
    return true;
  end if;

  -- 5. Access Inheritance: check if student purchased the complete parent course
  if v_course_id is not null and exists (
    select 1 from public.purchases
    where student_id = p_user_id
      and course_id = v_course_id
      and payment_status = 'completed'
  ) then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;


-- Function to check if a student has access to a resource
create or replace function public.has_resource_access(p_user_id uuid, p_resource_id uuid)
returns boolean as $$
declare
  v_access_type text;
  v_course_id text;
  v_lecture_id uuid;
begin
  -- 1. Admin access
  if exists (select 1 from public.user_roles where user_id = p_user_id and role = 'admin') then
    return true;
  end if;

  -- 2. Query resource details
  select access_type, course_id, lecture_id into v_access_type, v_course_id, v_lecture_id
  from public.resources
  where id = p_resource_id;

  if not found then
    return false;
  end if;

  -- 3. Free resources are open
  if v_access_type = 'free' then
    return true;
  end if;

  -- 4. Check parent course purchase
  if v_course_id is not null and exists (
    select 1 from public.purchases
    where student_id = p_user_id
      and course_id = v_course_id
      and payment_status = 'completed'
  ) then
    return true;
  end if;

  -- 5. Check parent lecture purchase
  if v_lecture_id is not null and exists (
    select 1 from public.purchases
    where student_id = p_user_id
      and lecture_id = v_lecture_id
      and payment_status = 'completed'
  ) then
    return true;
  end if;

  return false;
end;
$$ language plpgsql security definer;


-- =========================================================================
-- 8. INITIAL SEED DATA
-- =========================================================================
insert into public.courses (id, title, category, badge, price, original_price, description, thumbnail_key, mode, topics, highlights)
values
  (
    'class-11',
    'Class 11 Accountancy (Crash Course)',
    'Class 11 Commerce',
    'CLASS 11 COMMERCE',
    1200,
    null,
    'A comprehensive foundation in financial accounting, designed to help Class 11 Commerce students understand accounting concepts and develop strong numerical problem-solving skills. Covers accounting principles, accounting equations, journal entries, ledger posting, subsidiary books, cash book, bank reconciliation, depreciation, trial balance, rectification of errors and preparation of financial statements.',
    '/images/class-11-accountancy.jpg',
    'Accountancy Crash Course',
    array[
      'Introduction and Theory Base of Accounting',
      'Accounting Equation, Journal and Ledger',
      'Cash Book and Subsidiary Books',
      'Bank Reconciliation Statement',
      'Depreciation, Provisions, Reserves and Trial Balance',
      'Financial Statements and Incomplete Records'
    ],
    array[
      'Clear understanding of accounting concepts and terminology.',
      'Step-by-step journal entries, ledger posting and subsidiary books.',
      'Bank reconciliation, depreciation and rectification of errors.',
      'Preparation of financial statements and practical accounting numericals.'
    ]
  ),
  (
    'class-12',
    'Class 12 Accountancy (Crash Course)',
    'Class 12 Commerce',
    'CLASS 12 COMMERCE',
    1300,
    null,
    'An exam-focused Accountancy crash course for Class 12 Commerce students, covering partnership firms, company accounts and financial statement analysis. Develop strong numerical problem-solving skills through partnership adjustments, goodwill valuation, admission, retirement and dissolution of partners, share capital, debentures, accounting ratios and cash flow statements.',
    '/images/class-12-accountancy.jpg',
    'Accountancy Crash Course',
    array[
      'Partnership Fundamentals and Goodwill',
      'Change in Profit Sharing Ratio and Admission of a Partner',
      'Retirement, Death and Dissolution of a Partnership Firm',
      'Accounting for Share Capital',
      'Issue and Accounting for Debentures',
      'Financial Statement Analysis, Accounting Ratios and Cash Flow Statement'
    ],
    array[
      'Comprehensive coverage of partnership accounting and company accounts.',
      'Goodwill valuation and partnership adjustments.',
      'Share capital, issue and forfeiture of shares, and debentures.',
      'Financial statement analysis, accounting ratios and cash flow statements.'
    ]
  )
on conflict (id) do update
set
  title = excluded.title,
  category = excluded.category,
  badge = excluded.badge,
  description = excluded.description,
  price = excluded.price,
  original_price = excluded.original_price,
  thumbnail_key = excluded.thumbnail_key,
  mode = excluded.mode,
  topics = excluded.topics,
  highlights = excluded.highlights;

-- Seed initial Free Resources
insert into public.resources (id, title, description, file_key, file_type, file_format, category_label, access_type, is_published)
values
  (
    '00000000-0000-0000-0000-000000000001',
    'Class 11: Rules of Debit & Credit Quick Reference Chart',
    'A clear, structured visual reference chart categorizing traditional rules (Personal, Real, Nominal) alongside modern classification (Assets, Liabilities, Capital, Revenue, Expenses).',
    'notes/accountancy/rules-of-debit-credit.pdf',
    'pdf',
    'PDF Summary',
    'Class 11 Resources',
    'free',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Class 12: Partnership Accounts — Goodwill Valuation & Revaluation Notes',
    'Comprehensive formula sheet and adjustment templates for Average Profits, Super Profits, Capitalization methods, and revaluation account journal sequences.',
    'notes/accountancy/partnership-goodwill-revaluation.pdf',
    'pdf',
    'PDF Notes',
    'Class 12 Resources',
    'free',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Cash Flow Statement (AS-3 Revised) Format & Working Notes Template',
    'Step-by-step master format for Operating, Investing, and Financing activities, including provision for tax and proposed dividend treatment guidelines.',
    'notes/accountancy/cash-flow-as3-format.pdf',
    'notes',
    'Format Sheet',
    'Accountancy Notes',
    'free',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Company Accounts: Issue of Shares & Pro-Rata Table Guide',
    'Essential multi-step pro-rata calculation tables and forfeiture/reissue journal entries structured to prevent common numerical errors.',
    'notes/accountancy/shares-prorata-guide.pdf',
    'pdf',
    'PDF Guide',
    'PDF Study Materials',
    'free',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000005',
    'Class 11: Bank Reconciliation Statement (BRS) Logic Matrix',
    'Logical plus/minus chart for favorable vs. overdraft balances in Passbook and Cash Book, built to resolve reconciliation doubts quickly.',
    'notes/accountancy/brs-logic-matrix.pdf',
    'notes',
    'Study Matrix',
    'Class 11 Resources',
    'free',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    'Board Exam Presentation & Time Management Checklist',
    'Official guidelines for margin drawing, ledger formatting, narration writing, and marks-per-minute pacing in board examination conditions.',
    'notes/accountancy/board-presentation-checklist.pdf',
    'assignment',
    'Checklist PDF',
    'Practice Materials',
    'free',
    true
  )
on conflict (id) do nothing;
