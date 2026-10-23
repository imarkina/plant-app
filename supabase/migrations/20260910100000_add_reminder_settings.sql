-- US-ALBUM-5: photo-reminder settings + push subscriptions.
-- Follows the same per-user ownership + RLS pattern as 20260829120000_add_auth_scoping.sql.

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  push_enabled boolean not null default false,
  reminder_interval_days integer not null default 7 check (reminder_interval_days in (7, 14, 30)),
  reminder_time text not null default '09:00',
  streak_reminders_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can manage their own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  created_at timestamptz not null default now(),
  unique (user_id, endpoint)
);

alter table public.push_subscriptions enable row level security;

create policy "Users can manage their own push subscriptions"
  on public.push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Note: this migration only stores the client's subscription (what US-ALBUM-5 needs
-- to make the "Push-уведомления" toggle real). Actually delivering a push 7/14/30 days
-- later requires a server-side sender (e.g. web-push + VAPID keys) and a scheduler/cron
-- to read these rows and trigger sends -- neither exists in this project yet, so
-- scheduled delivery does not work end-to-end until that infra is added.
