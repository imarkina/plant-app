-- Persist "Оценить динамику" (photo-pair dynamics comparison) results.
-- Previously this AI comparison was only ever held in component state and
-- discarded on navigation/reload, forcing a re-run (a real AI call) every
-- time. Keyed on the exact photo pair it was computed from, so a saved
-- result stays an honest historical record rather than silently going
-- stale as new photos are added.

create table if not exists public.photo_comparisons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  plant_id uuid not null references public.plants(id) on delete cascade,
  first_photo_id uuid not null references public.photos(id) on delete cascade,
  last_photo_id uuid not null references public.photos(id) on delete cascade,
  result jsonb not null,
  created_at timestamptz not null default now(),
  unique (first_photo_id, last_photo_id)
);

create index if not exists photo_comparisons_plant_id_idx on public.photo_comparisons (plant_id);

alter table public.photo_comparisons enable row level security;

create policy "Users can manage their own photo comparisons"
  on public.photo_comparisons for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
