-- ========================================================
-- PRIME COMMERCE HUB — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ========================================================

-- 1. Profiles Table (Automatically synced from Google Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Trigger to auto-create profile on Google Login
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Courses Table
create table if not exists public.courses (
  id text primary key,
  title text not null,
  category text not null,
  badge text,
  price numeric not null,
  original_price numeric,
  description text,
  image text,
  mode text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.courses enable row level security;

create policy "Courses are viewable by everyone."
  on public.courses for select
  using ( true );

-- Seed default courses
insert into public.courses (id, title, category, badge, price, original_price, description, image, mode)
values
  (
    'class-11',
    'Class 11 Accountancy (Comprehensive Foundation)',
    'Class 11 Commerce',
    'FOUNDATION MODULE',
    12500,
    15000,
    'Designed to help students build an unbreakable foundation in financial accounting. Covers basic accounting principles, debit/credit logic, journal entries, ledger posting, trial balance, and financial statements.',
    '/images/accountancy-classroom.jpg',
    'Classroom Batches & Live Interactive Sessions'
  ),
  (
    'class-12',
    'Class 12 Accountancy (Board Excellence)',
    'Class 12 Commerce',
    'BOARD EXCELLENCE',
    14500,
    18000,
    'Comprehensive, result-oriented learning module for Class 12 Commerce students aiming for top percentiles and 100/100 in Board Examinations. Thorough coverage of Partnership, Company Accounts, and Financial Analysis.',
    '/images/course-work.jpg',
    'Classroom Batches & Live Interactive Sessions'
  )
on conflict (id) do nothing;


-- 3. Cart Items Table
create table if not exists public.cart_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, course_id)
);

alter table public.cart_items enable row level security;

create policy "Users can view their own cart items."
  on public.cart_items for select
  using ( auth.uid() = user_id );

create policy "Users can insert into their own cart."
  on public.cart_items for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete from their own cart."
  on public.cart_items for delete
  using ( auth.uid() = user_id );


-- 4. Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  total_amount numeric not null,
  currency text default 'INR',
  status text default 'paid', -- 'pending', 'paid', 'failed'
  payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Users can view their own orders."
  on public.orders for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders."
  on public.orders for insert
  with check ( auth.uid() = user_id );


-- 5. Enrollments Table (Access to purchased courses)
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  course_id text references public.courses(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  enrolled_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active',
  unique (user_id, course_id)
);

alter table public.enrollments enable row level security;

create policy "Users can view their own active enrollments."
  on public.enrollments for select
  using ( auth.uid() = user_id );
