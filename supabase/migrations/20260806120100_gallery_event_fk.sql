-- Links gallery photos to a real event row instead of a free-text label.
-- Existing rows keep their legacy `event` text (kept for display) and get
-- event_id = null, since old free-text labels can't be reliably matched to
-- real events automatically.

alter table public.gallery
  add column if not exists event_id bigint references public.events (id) on delete set null;

create index if not exists gallery_event_id_idx on public.gallery (event_id);
