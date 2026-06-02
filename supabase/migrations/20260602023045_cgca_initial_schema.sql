-- CGCA Initial Schema
-- All tables use RLS. Public read is allowed on content tables.
-- Write access requires authentication and is scoped to the user's own rows.

-- ----------------------------------------------------------------
-- profile
-- Auto-created when a new user signs up via the trigger below.
-- ----------------------------------------------------------------
create table if not exists public.profile (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null,
  name          text not null default '',
  phone_number  text not null default ''
);

alter table public.profile enable row level security;

create policy "Users can read their own profile"
  on public.profile for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profile for update
  using (auth.uid() = id);

-- Trigger: create profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profile (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------
-- events (admin-managed)
-- ----------------------------------------------------------------
create table if not exists public.events (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text not null default '',
  date        text not null,
  time        text not null default '',
  image_url   text not null default ''
);

alter table public.events enable row level security;

create policy "Anyone can read events"
  on public.events for select using (true);

create policy "Admins can insert events"
  on public.events for insert
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');

create policy "Admins can update events"
  on public.events for update
  using (auth.jwt() ->> 'email' = 'admin@admin.com');

create policy "Admins can delete events"
  on public.events for delete
  using (auth.jwt() ->> 'email' = 'admin@admin.com');

-- ----------------------------------------------------------------
-- sponsors (admin-managed)
-- ----------------------------------------------------------------
create table if not exists public.sponsors (
  id                    bigint generated always as identity primary key,
  sponsor               text not null,
  description           text not null default '',
  location              text,
  phone                 text not null default '',
  website               text,
  image_url             text,
  file_name             text,
  custom_file_name      text,
  logo_url              text,
  logo_file_name        text,
  custom_logo_file_name text
);

alter table public.sponsors enable row level security;

create policy "Anyone can read sponsors"
  on public.sponsors for select using (true);

create policy "Admins can manage sponsors"
  on public.sponsors for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');

-- ----------------------------------------------------------------
-- gallery (admin-managed)
-- ----------------------------------------------------------------
create table if not exists public.gallery (
  id               bigint generated always as identity primary key,
  image_url        text not null,
  file_name        text not null default '',
  custom_file_name text not null default '',
  event            text not null default ''
);

alter table public.gallery enable row level security;

create policy "Anyone can read gallery"
  on public.gallery for select using (true);

create policy "Admins can manage gallery"
  on public.gallery for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');
