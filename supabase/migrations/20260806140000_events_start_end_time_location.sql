-- Splits the single "time" field into start_time/end_time (end optional),
-- and adds a location field for the event form.
alter table public.events rename column time to start_time;
alter table public.events add column if not exists end_time text;
alter table public.events add column if not exists location text;
