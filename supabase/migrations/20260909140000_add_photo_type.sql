-- Adds a `photo_type` tag to photos (growth / purchase / diagnosis / archive),
-- for the Album feature's timeline grouping and the "type card" picker in the
-- add-photo flow. Defaults to 'growth' so every existing row (and any insert
-- that doesn't set it explicitly) stays valid.

alter table public.photos
  add column if not exists photo_type text not null default 'growth'
  check (photo_type in ('growth', 'purchase', 'diagnosis', 'archive'));
