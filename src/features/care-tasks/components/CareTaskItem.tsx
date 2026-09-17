import type { CareTask, CareTaskType } from '../models/care-tasks.model';
import { formatDue, getCareStatus, getNextDue } from '../models/care-tasks.helpers';
import { Droplet, FlaskConical, CloudRain, Camera } from 'lucide-react';
import type { ChangeEvent } from 'react';

type Props = {
  task: CareTask;
  onDone: () => void;
  onPhotoSelected: (task: CareTask, file: File) => void;
};

const TASK_META: Record<CareTaskType, { label: string; Icon: typeof Droplet }> = {
  watering: { label: 'Полив', Icon: Droplet },
  feeding: { label: 'Подкормка', Icon: FlaskConical },
  misting: { label: 'Опрыскивание', Icon: CloudRain },
  photo: { label: 'Сделать фото', Icon: Camera },
};

export const CareTaskItem = ({ task, onDone, onPhotoSelected }: Props) => {
  const status = getCareStatus(task);
  const nextDue = getNextDue(task);
  const { label, Icon } = TASK_META[task.type];

  const borderClass =
    status === 'overdue' ? 'border-danger' : status === 'soon' ? 'border-warn' : 'border-accent';
  const dueClass = status === 'overdue' ? 'font-semibold text-danger' : 'text-text-muted';

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onPhotoSelected(task, file);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border-l-4 bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150 ${borderClass}`}
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-text-secondary">
        <Icon size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-semibold text-text-primary">{label}</p>
        <p className={`mt-0.5 truncate text-caption ${dueClass}`}>
          {task.lastDoneAt === null ? 'Ещё не делали' : formatDue(nextDue)}
        </p>
      </div>
      {task.type === 'photo' ? (
        <label className="shrink-0 cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="hidden"
          />
          Сделать фото
        </label>
      ) : (
        status !== 'ok' && (
          <button
            type="button"
            onClick={onDone}
            className="shrink-0 cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white"
          >
            Готово
          </button>
        )
      )}
    </div>
  );
};
