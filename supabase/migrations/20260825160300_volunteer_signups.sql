-- Public, anonymous volunteer signups per event. Anyone can submit one (no
-- login required), but only the admin can read/update/delete them since
-- rows contain personal contact info. preferred_role_id is set once by the
-- submitter from that event's public role list; assigned_org_role_id is
-- set later, only by the admin, via the drag-and-drop organizer board.
-- These two FKs are independent on purpose.
create table if not exists public.volunteer_signups (
  id                  bigint generated always as identity primary key,
  event_id            bigint not null references public.events (id) on delete cascade,
  preferred_role_id   bigint references public.volunteer_roles (id) on delete set null,
  assigned_org_role_id bigint references public.volunteer_org_roles (id) on delete set null,
  name                text not null,
  email               text not null,
  phone               text not null default '',
  notes               text not null default '',
  created_at          timestamptz not null default now()
);

create index if not exists volunteer_signups_event_id_idx on public.volunteer_signups (event_id);
create index if not exists volunteer_signups_assigned_org_role_id_idx on public.volunteer_signups (assigned_org_role_id);

alter table public.volunteer_signups enable row level security;

drop policy if exists "Anyone can submit a volunteer signup" on public.volunteer_signups;
create policy "Anyone can submit a volunteer signup"
  on public.volunteer_signups for insert with check (true);

drop policy if exists "Admins can view volunteer signups" on public.volunteer_signups;
create policy "Admins can view volunteer signups"
  on public.volunteer_signups for select
  using (auth.jwt() ->> 'email' = 'admin@admin.com');

drop policy if exists "Admins can update volunteer signups" on public.volunteer_signups;
create policy "Admins can update volunteer signups"
  on public.volunteer_signups for update
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');

drop policy if exists "Admins can delete volunteer signups" on public.volunteer_signups;
create policy "Admins can delete volunteer signups"
  on public.volunteer_signups for delete
  using (auth.jwt() ->> 'email' = 'admin@admin.com');
