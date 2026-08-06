-- Gallery photos are actually organized by real storage-bucket folders
-- ("albums"), not by rows in the events table — reverts the event_id FK
-- added earlier and renames the grouping column accordingly.

alter table public.gallery drop constraint if exists gallery_event_id_fkey;
drop index if exists gallery_event_id_idx;
alter table public.gallery drop column if exists event_id;
alter table public.gallery rename column event to album;
