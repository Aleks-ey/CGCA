-- Many-to-many junction between volunteer_signups and volunteer_tags.
-- event_id is denormalized here (also derivable via either FK's join) so
-- that a Supabase Realtime postgres_changes filter of `event_id=eq.<id>`
-- can be applied directly on this table without a join, matching the
-- event-scoped filtering used on every other volunteer_* realtime stream.
create table if not exists public.volunteer_signup_tags (
  id                   bigint generated always as identity primary key,
  event_id             bigint not null references public.events (id) on delete cascade,
  volunteer_signup_id  bigint not null references public.volunteer_signups (id) on delete cascade,
  tag_id               bigint not null references public.volunteer_tags (id) on delete cascade,
  created_at           timestamptz not null default now(),
  unique (volunteer_signup_id, tag_id)
);

create index if not exists volunteer_signup_tags_event_id_idx on public.volunteer_signup_tags (event_id);
create index if not exists volunteer_signup_tags_signup_id_idx on public.volunteer_signup_tags (volunteer_signup_id);
create index if not exists volunteer_signup_tags_tag_id_idx on public.volunteer_signup_tags (tag_id);

alter table public.volunteer_signup_tags enable row level security;

drop policy if exists "Admins can manage volunteer signup tags" on public.volunteer_signup_tags;
create policy "Admins can manage volunteer signup tags"
  on public.volunteer_signup_tags for all
  using (auth.jwt() ->> 'email' = 'admin@admin.com')
  with check (auth.jwt() ->> 'email' = 'admin@admin.com');

-- Realtime: no table in this project has previously been added to the
-- supabase_realtime publication. Add every volunteer_* table the admin
-- board now needs live updates for. Guarded so re-running is a no-op.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'volunteer_signups'
  ) then
    alter publication supabase_realtime add table public.volunteer_signups;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'volunteer_org_roles'
  ) then
    alter publication supabase_realtime add table public.volunteer_org_roles;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'volunteer_tags'
  ) then
    alter publication supabase_realtime add table public.volunteer_tags;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'volunteer_signup_tags'
  ) then
    alter publication supabase_realtime add table public.volunteer_signup_tags;
  end if;
end $$;
