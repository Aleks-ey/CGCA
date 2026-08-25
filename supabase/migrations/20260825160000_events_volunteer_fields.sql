-- Lets admins optionally attach a volunteer signup form to an event.
-- Kept as plain columns on events (matching how location/cta_url were
-- added) since this data is small and always fetched together with the
-- event; the actual role options live in a separate child table.
alter table public.events add column if not exists volunteer_enabled boolean not null default false;
alter table public.events add column if not exists volunteer_info text not null default '';
