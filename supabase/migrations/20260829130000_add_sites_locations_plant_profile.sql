-- Adds the Site -> Location -> Plant hierarchy, a species catalog, richer
-- plant-profile fields (pot/substrate/purchase date), archiving, and a
-- care-event history log. Builds on top of
-- 20260829120000_add_auth_scoping.sql (user_id + RLS on plants/photos/
-- care_tasks) -- run that one first if it hasn't been applied yet.
--
-- Design notes (deviations from the loose sketch in the product spec):
--   * `locations` carries both `light_level` (natural light: direct /
--     bright_indirect / low_light) AND a separate `has_grow_light` toggle.
--     The spec's section 1.2 lists "grow lamp" as a third light *type*,
--     but Screen 2 lists it as an independent toggle -- modeling it as a
--     boolean overlay on top of the 3-value natural-light enum satisfies
--     both without conflating "no direct sun" with "has a grow lamp".
--   * `plants.archive_status` (died / given_away_or_sold / other) is split
--     from `archive_reason_detail` (free-text sub-reason, e.g. "перелив"),
--     matching Screen 5's two-level reason picker rather than the single
--     `archive_reason: string` field in the spec's data-architecture sketch.
--   * `plant_care_logs` is a new event-history table, separate from the
--     existing `care_tasks` (which only tracks the *next* reminder via
--     interval_days/last_done_at and overwrites last_done_at on each
--     completion). The spec's "история операций (когда поливали, когда
--     пересаживали)" needs a full timeline, which `care_tasks` cannot
--     provide on its own -- the two tables now serve complementary
--     purposes (schedule vs. history) rather than one replacing the other.
--   * `species` is a shared read-only catalog (no user_id / RLS owner
--     check) since it's reference data, not per-user data. Plants that
--     don't match a catalog entry use `custom_species_name` instead, per
--     Screen 3 ("выбор из справочника или ввод своего значения").

-- 0) Ensure gen_random_uuid() is available for the new tables' defaults --

create extension if not exists pgcrypto;

-- 1) Sites and locations -----------------------------------------------

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  window_direction text check (window_direction in ('N', 'S', 'E', 'W')),
  distance_from_window_cm integer check (distance_from_window_cm >= 0),
  light_level text check (light_level in ('direct', 'bright_indirect', 'low_light')),
  has_grow_light boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists locations_site_id_idx on public.locations (site_id);

-- 2) Species catalog (shared reference data, not per-user) --------------

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  common_name text not null,
  botanical_name text,
  created_at timestamptz not null default now()
);

-- 3) Plant profile fields -------------------------------------------------

alter table public.plants add column if not exists location_id uuid references public.locations(id) on delete set null;
alter table public.plants add column if not exists species_id uuid references public.species(id) on delete set null;
alter table public.plants add column if not exists custom_species_name text;
alter table public.plants add column if not exists purchased_at date;
alter table public.plants add column if not exists pot_type text check (pot_type in ('plastic', 'terracotta', 'ceramic_glazed', 'self_watering'));
alter table public.plants add column if not exists pot_diameter_cm integer check (pot_diameter_cm > 0);
alter table public.plants add column if not exists has_drainage boolean;
alter table public.plants add column if not exists substrate_type text check (substrate_type in ('standard', 'aroid_mix', 'mineral', 'other'));
alter table public.plants add column if not exists is_archived boolean not null default false;
alter table public.plants add column if not exists archive_status text check (archive_status in ('died', 'given_away_or_sold', 'other'));
alter table public.plants add column if not exists archive_reason_detail text;
alter table public.plants add column if not exists archived_at timestamptz;

create index if not exists plants_location_id_idx on public.plants (location_id);
create index if not exists plants_user_archived_idx on public.plants (user_id, is_archived);

-- 4) Photo avatar flag ("Кастомная аватарка") ----------------------------

alter table public.photos add column if not exists is_avatar boolean not null default false;

-- 5) Care event history (separate from the care_tasks reminder schedule) -

create table if not exists public.plant_care_logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  type text not null check (type in ('watering', 'fertilizing', 'misting', 'repotting', 'pruning', 'other')),
  note text,
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists plant_care_logs_plant_id_idx on public.plant_care_logs (plant_id, performed_at desc);

-- 6) RLS ------------------------------------------------------------------

alter table public.sites enable row level security;
alter table public.locations enable row level security;
alter table public.plant_care_logs enable row level security;
alter table public.species enable row level security;

create policy "Users can manage their own sites"
  on public.sites for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own locations"
  on public.locations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own care logs"
  on public.plant_care_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Species is a shared catalog: any authenticated user can read it, but
-- only a service-role connection (e.g. a seed script) can write to it --
-- no insert/update/delete policy is defined here on purpose.
create policy "Authenticated users can read the species catalog"
  on public.species for select
  to authenticated
  using (true);
