-- Single-row version counter for the gallery table, bumped once per
-- insert/update/delete statement (not per row). The public gallery page
-- polls this cheaply to decide whether it needs to re-fetch the full image
-- list, instead of re-querying it on every visit/refresh.

create table if not exists public.gallery_state (
  id integer primary key default 1,
  version bigint not null default 0,
  updated_at timestamptz not null default now(),
  constraint gallery_state_singleton check (id = 1)
);

insert into public.gallery_state (id, version)
values (1, 0)
on conflict (id) do nothing;

alter table public.gallery_state enable row level security;

drop policy if exists "Anyone can read gallery state" on public.gallery_state;
create policy "Anyone can read gallery state"
  on public.gallery_state for select using (true);

create or replace function public.bump_gallery_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.gallery_state
  set version = version + 1, updated_at = now()
  where id = 1;
  return null;
end;
$$;

drop trigger if exists on_gallery_changed on public.gallery;
create trigger on_gallery_changed
  after insert or update or delete on public.gallery
  for each statement execute procedure public.bump_gallery_version();
