-- US-ALBUM-5 backend: schedule the send-photo-reminders Edge Function.
--
-- 1) Track when a photo-type care task last got a push, so the hourly cron
--    run doesn't re-notify the same task every time it fires.
alter table public.care_tasks add column if not exists last_reminder_sent_at timestamptz;

-- 2) pg_cron/pg_net let Postgres itself call the Edge Function on a schedule.
--    On hosted Supabase these are usually pre-installed; enabling them here
--    requires the migration to run with sufficient privileges. If `supabase
--    db push` errors on these two lines, enable both extensions once via
--    Dashboard -> Database -> Extensions, then re-run the migration.
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- 3) The cron job needs your project's service-role key to call the function
--    (it runs with elevated access, bypassing RLS, same as any scheduled
--    server-side job). Store it in Vault -- NEVER put the raw key in a
--    migration file. Run this once in the SQL editor, with your own key:
--
--      select vault.create_secret('<your-service-role-key>', 'service_role_key');
--
--    Then replace <project-ref> below with your actual project ref and run
--    this migration (or paste the block into the SQL editor).
select
  cron.schedule(
    'send-photo-reminders-hourly',
    '0 * * * *', -- every hour, on the hour (UTC)
    $$
    select net.http_post(
      url := 'https://<project-ref>.functions.supabase.co/send-photo-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key'
        )
      ),
      body := jsonb_build_object('scheduled_at', now())
    ) as request_id;
    $$
  );

-- To remove the schedule later: select cron.unschedule('send-photo-reminders-hourly');
