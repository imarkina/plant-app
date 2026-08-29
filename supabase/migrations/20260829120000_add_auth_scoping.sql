-- Scope plants/photos/care_tasks to the authenticated user and enforce it via RLS.
-- Run this manually in the Supabase SQL editor (or `supabase db push` once the
-- project has a local Supabase CLI setup).

-- 1) Add ownership columns (nullable for now so existing rows don't break the migration).
alter table public.plants add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.photos add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.care_tasks add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2) No real users exist yet, so pre-auth rows have no owner to backfill onto.
--    Remove them instead of leaving orphaned data. Skip this block if you need
--    to keep specific rows -- in that case backfill user_id by hand first.
delete from public.care_tasks;
delete from public.photos;
delete from public.plants;

-- 3) Make ownership mandatory and auto-filled on every future insert.
alter table public.plants alter column user_id set not null;
alter table public.plants alter column user_id set default auth.uid();

alter table public.photos alter column user_id set not null;
alter table public.photos alter column user_id set default auth.uid();

alter table public.care_tasks alter column user_id set not null;
alter table public.care_tasks alter column user_id set default auth.uid();

-- 4) Enable RLS and restrict every row to its owner.
alter table public.plants enable row level security;
alter table public.photos enable row level security;
alter table public.care_tasks enable row level security;

create policy "Users can manage their own plants"
  on public.plants for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own photos"
  on public.photos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own care tasks"
  on public.care_tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Note: the `plant-photos` storage bucket is still publicly readable and is
-- NOT scoped by this migration -- storage-level RLS/path-per-user is a
-- separate follow-up (planned for the httpOnly-cookie/BFF phase).
