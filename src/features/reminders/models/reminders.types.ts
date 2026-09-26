export interface UserSettings {
  pushEnabled: boolean;
  reminderTime: string;
  streakRemindersEnabled: boolean;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  pushEnabled: false,
  reminderTime: '09:00',
  streakRemindersEnabled: true,
};

export interface PushSubscriptionKeys {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export interface RemindersRepository {
  getSettings(userId: string): Promise<UserSettings>;
  updateSettings(userId: string, update: Partial<UserSettings>): Promise<UserSettings>;
  savePushSubscription(userId: string, keys: PushSubscriptionKeys): Promise<void>;
  deletePushSubscription(userId: string, endpoint: string): Promise<void>;
}
