-- Purely internal admin sorting buckets for organizing volunteers on the
-- per-event admin board (drag-and-drop). Intentionally a separate table
-- from volunteer_roles so creating/renaming these buckets can never affect
-- the public-facing preferred-role list on the signup form. Never exposed
-- publicly, so there is no public select policy at all.
create table if not exists public.volunteer_org_roles (
  id         bigint generated always as identity primary key,
  event_id   bigint not null references public.events (id) on delete cascade,
  label      text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists volunteer_org_roles_event_id_idx on public.volunteer_org_roles (event_id);

alter table public.volunteer_org_roles enable row level security;

drop policy if exists "Admins can manage volunteer org roles" on public.volunteer_org_roles;
create policy "Admins can manage volunteer org roles"
  on public.volunteer_org_roles for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');
