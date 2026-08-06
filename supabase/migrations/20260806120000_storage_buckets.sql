-- Storage buckets used by the app.
-- The "gallery" bucket already exists as manually-created state on the
-- hosted project (referenced in code since day one, never provisioned by a
-- migration), so a fresh `supabase db reset` locally has had no working
-- bucket at all. This formalizes it alongside the new "event-images" bucket
-- so both are reproducible from migrations.

insert into storage.buckets (id, name, public, file_size_limit)
values ('event-images', 'event-images', true, 52428800)
on conflict (id) do nothing;

drop policy if exists "Public can read event images" on storage.objects;
create policy "Public can read event images"
  on storage.objects for select
  using (bucket_id = 'event-images');

drop policy if exists "Admins can upload event images" on storage.objects;
create policy "Admins can upload event images"
  on storage.objects for insert
  with check (bucket_id = 'event-images' and (select auth.jwt() ->> 'email') = 'admin@admin.com');

drop policy if exists "Admins can update event images" on storage.objects;
create policy "Admins can update event images"
  on storage.objects for update
  using (bucket_id = 'event-images' and (select auth.jwt() ->> 'email') = 'admin@admin.com');

drop policy if exists "Admins can delete event images" on storage.objects;
create policy "Admins can delete event images"
  on storage.objects for delete
  using (bucket_id = 'event-images' and (select auth.jwt() ->> 'email') = 'admin@admin.com');

insert into storage.buckets (id, name, public, file_size_limit)
values ('gallery', 'gallery', true, 52428800)
on conflict (id) do nothing;

drop policy if exists "Public can read gallery images" on storage.objects;
create policy "Public can read gallery images"
  on storage.objects for select
  using (bucket_id = 'gallery');

drop policy if exists "Admins can manage gallery images" on storage.objects;
create policy "Admins can manage gallery images"
  on storage.objects for all
  using (bucket_id = 'gallery' and (select auth.jwt() ->> 'email') = 'admin@admin.com')
  with check (bucket_id = 'gallery' and (select auth.jwt() ->> 'email') = 'admin@admin.com');
