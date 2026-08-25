-- Optional "preferred role" options an admin configures per event, shown
-- as a dropdown on that event's public volunteer signup form. Editable
-- only from the event's admin editor.
create table if not exists public.volunteer_roles (
  id         bigint generated always as identity primary key,
  event_id   bigint not null references public.events (id) on delete cascade,
  label      text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists volunteer_roles_event_id_idx on public.volunteer_roles (event_id);

alter table public.volunteer_roles enable row level security;

drop policy if exists "Anyone can read volunteer roles" on public.volunteer_roles;
create policy "Anyone can read volunteer roles"
  on public.volunteer_roles for select using (true);

drop policy if exists "Admins can manage volunteer roles" on public.volunteer_roles;
create policy "Admins can manage volunteer roles"
  on public.volunteer_roles for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');
