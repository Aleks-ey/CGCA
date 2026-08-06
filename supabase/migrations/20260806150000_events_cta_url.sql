-- Replaces the hardcoded "Buy Tickets" link in the event card with a
-- per-event, admin-editable call-to-action URL.
alter table public.events add column if not exists cta_url text;
