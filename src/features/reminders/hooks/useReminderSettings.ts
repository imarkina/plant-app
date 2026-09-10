import { useEffect, useState } from 'react';
import { useAuthContext } from '../../auth';
import { remindersRepository } from '../models/reminders.repository';
import { DEFAULT_USER_SETTINGS, type UserSettings } from '../models/reminders.types';

export function useReminderSettings() {
  const { user } = useAuthContext();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      queueMicrotask(() => setLoading(false));
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const loaded = await remindersRepository.getSettings(user.id);
        if (!cancelled) {
          setSettings(loaded);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateSettings = async (update: Partial<UserSettings>) => {
    if (!user) {
      return;
    }
    const next = await remindersRepository.updateSettings(user.id, update);
    setSettings(next);
  };

  return { settings, loading, updateSettings };
}
