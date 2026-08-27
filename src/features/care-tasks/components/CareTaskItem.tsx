import type { CareTask, CareTaskType } from '../models/care-tasks.model';
import { formatDue, getCareStatus, getNextDue } from '../models/care-tasks.helpers';
import './CareTaskItem.css';
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

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      onPhotoSelected(task, file);
    }
  };

  return (
    <div className={`care-item care-item--${status}`}>
      <div className="care-item__icon">
        <Icon size={22} />
      </div>
      <div className="care-item__info">
        <p className="care-item__title">{label}</p>
        <p className="care-item__due">{formatDue(nextDue)}</p>
      </div>
      {task.type === 'photo' ? (
        <label className="care-item__btn">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />
          Сделать фото
        </label>
      ) : (
        status !== 'ok' && (
          <button className="care-item__btn" onClick={onDone}>
            Готово
          </button>
        )
      )}
    </div>
  );
};
