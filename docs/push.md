# Push notifications

How a care-task reminder actually reaches the user's device. Read this before touching
`features/reminders/*`, `public/push-sw.js`, `vite.config.ts`'s PWA block, or
`supabase/functions/send-photo-reminders/`.

## The three pieces, and which repo they live in

Web Push needs three cooperating parts; all three exist in this project (an older comment in
`push-sw.js` claims the sending side "does not exist yet" — that's stale, left over from before
the Supabase Edge Function below was built; don't trust that comment over this doc or the actual
function code).

1. **Browser: subscribe.** `usePushSubscription` (`features/reminders/hooks`) requests
   notification permission, registers `/sw.js` (the Workbox-generated service worker, not
   `push-sw.js` directly — see below), and creates a `PushManager` subscription using
   `VITE_VAPID_PUBLIC_KEY`. The subscription (endpoint + `p256dh`/`auth` keys) is persisted via
   `remindersRepository.savePushSubscription` to the `push_subscriptions` table. Without
   `VITE_VAPID_PUBLIC_KEY` set, `subscribe()` fails early and only the user's on/off *preference*
   is saved (`user_settings.push_enabled`) — the toggle looks real in the UI but nothing will
   actually arrive.

2. **Browser: receive.** `public/push-sw.js` holds the `push` and `notificationclick` listeners
   — `showNotification(...)` on a push event, focus-or-open the right URL on click. This file is
   not itself registered as the service worker; `vite-plugin-pwa`'s `workbox.importScripts:
   ['push-sw.js']` (`vite.config.ts`) splices it into the Workbox-generated `/sw.js` at build
   time. If you add a new push-related listener, it goes in `push-sw.js`, not in a new file —
   adding a second service worker file would conflict with the PWA plugin's generated one.

3. **Server: send.** `supabase/functions/send-photo-reminders/index.ts` is a Supabase Edge
   Function (Deno), invoked roughly hourly by `pg_cron`
   (`supabase/migrations/20260910110000_schedule_photo_reminders.sql`). Despite the directory
   name (`send-photo-reminders`, from when this only handled the old photo-timeline reminder,
   US-ALBUM-5), it now sends for every `care_tasks` type — `photo`, `watering`, `feeding`,
   `misting` — since watering/feeding/misting intervals are now AI-derived
   (`useApplyCarePassport`, see `docs/ai-pipeline.md`) rather than purely informational. Needs
   `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` as function secrets (separate from
   the frontend's `VITE_VAPID_PUBLIC_KEY` — same public key value, but it must also be set here
   for `web-push` to sign with); `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are provided
   automatically by the platform.

## The due/eligible logic (`send-photo-reminders/index.ts`)

A task is **due** (`isDue`) when: it has been completed at least once (`last_done_at` is set —
a never-done task waits for the user's first visit instead of pushing immediately),
`last_done_at + interval_days` has passed, and it hasn't already been reminded about in the last
24h (`last_reminder_sent_at`).

A due task is only sent if its owner is **eligible**: `user_settings.push_enabled` is true *and*
the current UTC hour matches the hour component of their `reminder_time` — so this only fires
once a day, in the user's chosen hour, not every time the hourly cron runs.

After sending, `care_tasks.last_reminder_sent_at` is stamped for every notified task (prevents
re-sending next hour), and any subscription that `web-push` reports as gone (HTTP 404/410) is
deleted from `push_subscriptions` — that's the only place stale subscriptions get cleaned up, so
don't assume every row in that table is still valid without that context.

## If you're adding a new reminder type

1. Add the new `care_tasks.type` value (migration) and teach whatever derives intervals for it
   (see `docs/ai-pipeline.md`'s `useApplyCarePassport` section, or hardcode it if it's not
   AI-derived).
2. Add copy for it to `NOTIFICATION_COPY` in `send-photo-reminders/index.ts` — the `.in('type',
   [...])` filter on the initial `care_tasks` query also needs the new type added, or it will
   silently never be picked up.
3. You don't need to touch `push-sw.js` or the subscribe flow — both are generic over whatever
   `title`/`body`/`url` payload the server sends.
