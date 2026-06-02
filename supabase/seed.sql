-- ============================================================
-- seed.sql — local development seed data
-- Only runs during `supabase db reset`, not in production.
-- ============================================================

-- Sample event
insert into public.events (title, description, date, time, image_url)
values
  ('CGCA Summer Gathering', 'Annual summer celebration of Georgian culture in Colorado.', '2026-07-15', '6:00 PM', '');

-- Sample sponsor
insert into public.sponsors (sponsor, description, location, phone, website)
values
  ('Georgian Wine House', 'Authentic Georgian wines imported directly from Kakheti.', 'Denver, CO', '(720) 555-0100', 'https://example.com');
