-- `locations.site_id` was added as `not null` in
-- 20260829130000_add_sites_locations_plant_profile.sql, anticipating a
-- Site -> Location hierarchy. That hierarchy was never built at the
-- application layer -- there is no `sites` feature, no UI to create or pick
-- a site, and `locationsRepository.create()` has never passed a `site_id`.
-- Generating real Supabase types just surfaced this: every location
-- creation has been violating this not-null constraint. Since nothing in
-- the app assigns locations to sites, drop the requirement instead of
-- inventing a "default site" the product never asked for.

alter table public.locations alter column site_id drop not null;
