-- Per-event admin-managed tags for labeling volunteer signups (e.g. "brings
-- own tools", "returning volunteer"). Deliberately its own table, scoped to
-- event_id, same as volunteer_org_roles — never exposed publicly.
create table if not exists public.volunteer_tags (
  id         bigint generated always as identity primary key,
  event_id   bigint not null references public.events (id) on delete cascade,
  label      text not null,
  created_at timestamptz not null default now()
);

create index if not exists volunteer_tags_event_id_idx on public.volunteer_tags (event_id);

alter table public.volunteer_tags enable row level security;

drop policy if exists "Admins can manage volunteer tags" on public.volunteer_tags;
create policy "Admins can manage volunteer tags"
  on public.volunteer_tags for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');
