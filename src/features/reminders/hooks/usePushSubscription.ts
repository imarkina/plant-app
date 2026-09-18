import { useEffect, useState } from 'react';
import { useAuthContext } from '../../auth';
import { remindersRepository } from '../models/reminders.repository';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

function subscriptionToKeys(subscription: PushSubscription) {
  const json = subscription.toJSON();
  return {
    endpoint: subscription.endpoint,
    p256dh: json.keys?.p256dh ?? '',
    auth: json.keys?.auth ?? '',
  };
}

export const PUSH_SUPPORTED =
  typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;

/**
 * Real Web Push subscribe/unsubscribe plumbing: requests notification permission,
 * registers the service worker, and creates a PushManager subscription persisted
 * to `push_subscriptions`. Sending an actual push to that subscription later
 * (e.g. 7 days from now) requires a server with the VAPID private key and a
 * scheduler -- that piece isn't part of this app, so subscribing here makes the
 * toggle real without making scheduled delivery work end-to-end.
 */
export function usePushSubscription() {
  const { user } = useAuthContext();
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!PUSH_SUPPORTED) {
      return;
    }

    let cancelled = false;

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => registration?.pushManager.getSubscription())
      .then((existing) => {
        if (!cancelled && existing) {
          setSubscription(existing);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const subscribe = async (): Promise<boolean> => {
    setError(null);

    if (!PUSH_SUPPORTED) {
      setError('Push-уведомления не поддерживаются этим браузером.');
      return false;
    }

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      setError('Push пока не настроен на сервере (нет VAPID-ключа) — сохранили только твой выбор.');
      return false;
    }

    if (!user) {
      return false;
    }

    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setError('Разрешение на уведомления не получено.');
        return false;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      await remindersRepository.savePushSubscription(user.id, subscriptionToKeys(pushSubscription));
      setSubscription(pushSubscription);
      return true;
    } catch {
      setError('Не удалось оформить push-подписку.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async (): Promise<void> => {
    if (!subscription) {
      return;
    }

    setBusy(true);
    try {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();
      if (user) {
        await remindersRepository.deletePushSubscription(user.id, endpoint);
      }
      setSubscription(null);
    } finally {
      setBusy(false);
    }
  };

  return { subscription, subscribed: subscription !== null, subscribe, unsubscribe, busy, error };
}
