// Scheduled Edge Function for US-ALBUM-5's real push reminders.
//
// Invoked roughly hourly by pg_cron (see the accompanying migration
// 20260910110000_schedule_photo_reminders.sql). For every photo-type care
// task that is overdue, hasn't been reminded about today, and whose owner
// has push enabled + this is (approximately) their chosen reminder hour, it
// sends a real Web Push notification to every subscription that user has
// registered from the browser (features/reminders/hooks/usePushSubscription.ts).
//
// Requires these function secrets (see deploy instructions):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@example.com)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase platform to every Edge Function.

import { createClient } from 'npm:@supabase/supabase-js@2';
import webpush from 'npm:web-push@3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') ?? 'mailto:noreply@example.com';

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const DAY_MS = 24 * 60 * 60 * 1000;

type CareTaskRow = {
  id: string;
  plant_id: string;
  user_id: string;
  interval_days: number;
  last_done_at: string | null;
  last_reminder_sent_at: string | null;
};

type PushSubRow = { user_id: string; endpoint: string; keys_p256dh: string; keys_auth: string };

function isDue(task: CareTaskRow, now: number): boolean {
  if (task.last_done_at === null) {
    // Никогда не фотографировали -- ждём первого визита в приложение, а не пушим сразу.
    return false;
  }

  const nextDue = new Date(task.last_done_at).getTime() + task.interval_days * DAY_MS;
  if (nextDue > now) {
    return false;
  }

  if (task.last_reminder_sent_at) {
    const sinceLastReminder = now - new Date(task.last_reminder_sent_at).getTime();
    if (sinceLastReminder < DAY_MS) {
      return false; // уже напоминали в течение последних суток
    }
  }

  return true;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const now = Date.now();
  const currentHour = new Date().getUTCHours();

  const { data: tasks, error: tasksError } = await supabase
    .from('care_tasks')
    .select('id, plant_id, user_id, interval_days, last_done_at, last_reminder_sent_at')
    .eq('type', 'photo');

  if (tasksError) {
    return new Response(JSON.stringify({ error: tasksError.message }), { status: 500 });
  }

  const due = ((tasks ?? []) as CareTaskRow[]).filter((task) => isDue(task, now));
  if (due.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: 'nothing due' }), { status: 200 });
  }

  const userIds = [...new Set(due.map((task) => task.user_id))];

  const { data: settingsRows } = await supabase
    .from('user_settings')
    .select('user_id, push_enabled, reminder_time')
    .in('user_id', userIds);

  const eligibleUserIds = new Set(
    (settingsRows ?? [])
      .filter((s) => s.push_enabled && Number(String(s.reminder_time).split(':')[0]) === currentHour)
      .map((s) => s.user_id),
  );

  const eligibleTasks = due.filter((task) => eligibleUserIds.has(task.user_id));
  if (eligibleTasks.length === 0) {
    return new Response(JSON.stringify({ sent: 0, reason: 'no user due this hour' }), { status: 200 });
  }

  const plantIds = [...new Set(eligibleTasks.map((task) => task.plant_id))];
  const { data: plantRows } = await supabase.from('plants').select('id, name').in('id', plantIds);
  const plantNameById = new Map((plantRows ?? []).map((p) => [p.id, p.name as string]));

  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, keys_p256dh, keys_auth')
    .in('user_id', [...eligibleUserIds]);

  const subsByUser = new Map<string, PushSubRow[]>();
  for (const sub of (subs ?? []) as PushSubRow[]) {
    const list = subsByUser.get(sub.user_id) ?? [];
    list.push(sub);
    subsByUser.set(sub.user_id, list);
  }

  let sent = 0;
  const staleEndpoints: string[] = [];
  const notifiedTaskIds: string[] = [];

  for (const task of eligibleTasks) {
    const userSubs = subsByUser.get(task.user_id) ?? [];
    if (userSubs.length === 0) {
      continue;
    }

    const plantName = plantNameById.get(task.plant_id) ?? 'растение';
    const payload = JSON.stringify({
      title: `📸 Пора сфоткать ${plantName}!`,
      body: 'Обнови таймлайн роста — это займёт пару секунд.',
      url: `/plant/${task.plant_id}`,
    });

    let anySent = false;
    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth } },
          payload,
        );
        anySent = true;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          staleEndpoints.push(sub.endpoint);
        }
      }
    }

    if (anySent) {
      sent += 1;
      notifiedTaskIds.push(task.id);
    }
  }

  if (notifiedTaskIds.length > 0) {
    await supabase
      .from('care_tasks')
      .update({ last_reminder_sent_at: new Date().toISOString() })
      .in('id', notifiedTaskIds);
  }

  if (staleEndpoints.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', staleEndpoints);
  }

  return new Response(JSON.stringify({ sent, staleRemoved: staleEndpoints.length }), { status: 200 });
});
