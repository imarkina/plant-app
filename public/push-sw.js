// Web Push handlers for US-ALBUM-5, imported into the Workbox-generated
// service worker via vite.config.ts's `workbox.importScripts`.
//
// This only handles the browser side of push delivery: showing a notification
// when the browser receives a push message, and focusing/opening the app when
// the user taps it. It does NOT send anything on a schedule by itself --
// actually triggering a push 7/14/30 days later requires a server that holds
// the subscription (see the `push_subscriptions` table) and sends to it via
// the Web Push protocol (e.g. the `web-push` npm package + VAPID keys) on a
// cron/scheduler. That backend piece does not exist in this project yet.

self.addEventListener('push', (event) => {
  let payload = { title: 'Plant Parent OS', body: 'Пора позаботиться о растении 🌿' };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch {
      payload.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      data: { url: payload.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
