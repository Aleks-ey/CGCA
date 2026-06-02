-- ============================================================
-- 0001_initial_schema.sql
-- Creates a `profiles` table linked to Supabase Auth users,
-- with a trigger to auto-create a profile on signup.
-- ============================================================

-- Profiles table: extends the built-in auth.users table
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  username   text unique,
  full_name  text,
  avatar_url text,

  constraint username_length check (char_length(username) >= 3)
);

-- Automatically update `updated_at` on row change
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;

-- Users can only read/update their own profile
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow profile reads for authenticated users (optional — remove for stricter privacy)
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);
