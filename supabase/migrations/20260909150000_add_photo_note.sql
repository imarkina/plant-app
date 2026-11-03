-- Adds a free-text `note` to photos (e.g. "Только куплена в IKEA. 3 листа,
-- корни в порядке.") shown under each entry in the growth timeline.

alter table public.photos add column if not exists note text;
