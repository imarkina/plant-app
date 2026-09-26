import { supabase } from '../../../shared/supabase/client';
import {
  DEFAULT_USER_SETTINGS,
  type PushSubscriptionKeys,
  type RemindersRepository,
  type UserSettings,
} from './reminders.types';

type UserSettingsRow = {
  push_enabled: boolean;
  reminder_time: string;
  streak_reminders_enabled: boolean;
};

function rowToSettings(row: UserSettingsRow): UserSettings {
  return {
    pushEnabled: row.push_enabled,
    reminderTime: row.reminder_time,
    streakRemindersEnabled: row.streak_reminders_enabled,
  };
}

class SupabaseRemindersRepository implements RemindersRepository {
  async getSettings(userId: string): Promise<UserSettings> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('push_enabled, reminder_time, streak_reminders_enabled')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? rowToSettings(data) : DEFAULT_USER_SETTINGS;
  }

  async updateSettings(userId: string, update: Partial<UserSettings>): Promise<UserSettings> {
    const current = await this.getSettings(userId);
    const merged: UserSettings = { ...current, ...update };

    const { data, error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          push_enabled: merged.pushEnabled,
          reminder_time: merged.reminderTime,
          streak_reminders_enabled: merged.streakRemindersEnabled,
        },
        { onConflict: 'user_id' },
      )
      .select('push_enabled, reminder_time, streak_reminders_enabled')
      .single();

    if (error) {
      throw error;
    }

    return rowToSettings(data);
  }

  async savePushSubscription(userId: string, keys: PushSubscriptionKeys): Promise<void> {
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: keys.endpoint,
        keys_p256dh: keys.p256dh,
        keys_auth: keys.auth,
      },
      { onConflict: 'user_id,endpoint' },
    );

    if (error) {
      throw error;
    }
  }

  async deletePushSubscription(userId: string, endpoint: string): Promise<void> {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId)
      .eq('endpoint', endpoint);

    if (error) {
      throw error;
    }
  }
}

export const remindersRepository = new SupabaseRemindersRepository();
