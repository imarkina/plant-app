import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../auth';
import { remindersRepository } from '../models/reminders.repository';
import { DEFAULT_USER_SETTINGS, type UserSettings } from '../models/reminders.types';

const reminderSettingsKey = (userId: string) => ['reminder-settings', userId] as const;

export function useReminderSettings() {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: reminderSettingsKey(user?.id ?? 'anonymous'),
    queryFn: () => remindersRepository.getSettings(user!.id),
    enabled: user !== null,
  });

  const settings = settingsQuery.data ?? DEFAULT_USER_SETTINGS;

  const updateSettingsMutation = useMutation({
    mutationFn: (update: Partial<UserSettings>) => remindersRepository.updateSettings(user!.id, update),
    onSuccess: (next) => {
      queryClient.setQueryData(reminderSettingsKey(user!.id), next);
    },
  });

  const updateSettings = async (update: Partial<UserSettings>) => {
    if (!user) {
      return;
    }
    await updateSettingsMutation.mutateAsync(update);
  };

  return { settings, loading: user !== null && settingsQuery.isPending, updateSettings };
}
