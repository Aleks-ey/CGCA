-- Lets admins hide a sponsor from the public site without deleting it.

alter table public.sponsors
  add column if not exists hidden boolean not null default false;

-- Public sponsors page/carousel should only ever see visible sponsors.
-- Admins still see everything via the existing "admin access" policy
-- (permissive SELECT policies are OR'd together). The live policy name
-- ("Enable read access for all users") is a Supabase-Studio default, not
-- the name in the original migration file — confirmed via
-- `supabase db query --linked` against pg_policies before writing this.
drop policy if exists "Enable read access for all users" on public.sponsors;
create policy "Anyone can read visible sponsors"
  on public.sponsors for select
  using (not hidden);
