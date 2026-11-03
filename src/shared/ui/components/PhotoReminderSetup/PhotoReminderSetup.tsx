import { Camera } from 'lucide-react';
import { formatInterval } from '../../../helpers';
import { useState } from 'react';

type Props = {
  onCreate: (intervalDays: number) => void;
};

const PRESETS = [7, 14, 30];

export const PhotoReminderSetup = ({ onCreate }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [interval, setInterval] = useState(14);

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-surface-glass-border bg-surface-glass px-4 py-3 text-body-sm font-semibold text-text-secondary shadow-md backdrop-blur-xl backdrop-saturate-150"
      >
        <Camera size={18} className="text-brand-purple" /> Напоминать фотографировать
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
      <p className="text-body-sm font-semibold text-text-primary">Как часто напоминать сделать фото?</p>
      <div className="mt-3 flex gap-2">
        {PRESETS.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => setInterval(days)}
            className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-semibold backdrop-blur-xl backdrop-saturate-150 transition-colors ${
              interval === days
                ? 'bg-bg-elevated text-accent shadow-card'
                : 'border border-surface-glass-border bg-surface-glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {formatInterval(days)}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onCreate(interval)}
        className="mt-3 w-full cursor-pointer rounded-full bg-brand px-4 py-2.5 text-button font-sans font-semibold text-white shadow-fab"
      >
        Создать напоминание
      </button>
    </div>
  );
};
