import { useCareTasks } from '../hooks/useCareTasks';
import { CareTaskItem } from './CareTaskItem';
import { createDefaultTasks } from '../models/care-tasks.helpers';
import type { CareTask } from '../models/care-tasks.model';
import { PhotoReminderSetup } from '../../../shared/ui/components/PhotoReminderSetup/PhotoReminderSetup';

type Props = {
  plantId: string;
  onPhotoSelected: (task: CareTask, file: File) => void;
};

export const CareTab = ({ plantId, onPhotoSelected }: Props) => {
  const { tasks, loading, markDone, addTask } = useCareTasks(plantId);

  const hasPhotoTask = tasks.some((t) => t.type === 'photo');

  const handleCreatePhotoReminder = (intervalDays: number) => {
    void addTask({
      id: crypto.randomUUID(),
      plantId,
      type: 'photo',
      intervalDays,
      // Первое напоминание должно прийти через полный интервал, а не сразу же.
      lastDoneAt: Date.now(),
    });
  };

  if (loading) {
    return <p className="mt-6 text-body-sm text-text-muted">Загрузка...</p>;
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-center gap-3 rounded-3xl border border-surface-glass-border bg-surface-glass p-8 text-center shadow-card backdrop-blur-xl backdrop-saturate-150">
        <p className="text-body-sm text-text-muted">Задачи ухода ещё не настроены</p>
        <button
          type="button"
          onClick={() => createDefaultTasks(plantId, addTask)}
          className="cursor-pointer rounded-full bg-brand px-6 py-3 text-button font-sans font-semibold text-white"
        >
          Создать план ухода
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-2.5">
        {tasks.map((task) => (
          <CareTaskItem
            key={task.id}
            task={task}
            onDone={() => void markDone(task.id)}
            onPhotoSelected={onPhotoSelected}
          />
        ))}
      </div>
      {!hasPhotoTask && (
        <div className="mt-3">
          <PhotoReminderSetup onCreate={handleCreatePhotoReminder} />
        </div>
      )}
    </div>
  );
};
