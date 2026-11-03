-- Wishlist: plants the user wants to buy, separate from the `plants` table
-- (which tracks plants already owned/diagnosed). Purely a user-scoped list,
-- no relation to any other table.

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  image_url text,
  is_purchased boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.wishlist enable row level security;

create policy "Users can manage their own wishlist"
  on public.wishlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
