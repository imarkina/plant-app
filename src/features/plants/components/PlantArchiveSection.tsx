import { useState } from 'react';
import type { ArchiveStatus, Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { Button } from '../../../shared/ui/components/Button/Button';

const ARCHIVE_STATUS_OPTIONS: { value: ArchiveStatus; label: string }[] = [
  { value: 'died', label: 'Погиб' },
  { value: 'given_away_or_sold', label: 'Подарен / продан' },
  { value: 'other', label: 'Другое' },
];

const ARCHIVE_FAILED_MESSAGE = 'Не удалось отправить в архив';
const RESTORE_FAILED_MESSAGE = 'Не удалось восстановить растение';

type Props = {
  plant: Plant;
};

export const PlantArchiveSection = ({ plant }: Props) => {
  const { archive, restore } = usePlantsContext();
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<ArchiveStatus>('died');
  const [reasonDetail, setReasonDetail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (plant.isArchived) {
    const statusLabel = ARCHIVE_STATUS_OPTIONS.find(
      (option) => option.value === plant.archiveStatus,
    )?.label;

    const handleRestore = async () => {
      setError(null);
      setSubmitting(true);

      try {
        await restore(plant.id);
      } catch {
        setError(RESTORE_FAILED_MESSAGE);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="rounded-3xl border border-surface-glass-border bg-bg-tertiary p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
        <p className="mb-3 text-body-sm text-text-primary">
          В архиве{statusLabel ? `: ${statusLabel}` : ''}
          {plant.archiveReasonDetail ? ` — ${plant.archiveReasonDetail}` : ''}
        </p>
        {error && <div className="mb-3 text-body-sm text-danger">{error}</div>}
        <Button
          type="button"
          variant="glass"
          onClick={() => void handleRestore()}
          disabled={submitting}
        >
          {submitting ? 'Восстанавливаем...' : 'Восстановить'}
        </Button>
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        type="button"
        onClick={() => setShowForm(true)}
        className="block w-full cursor-pointer rounded-2xl border-[1.5px] border-dashed border-danger px-4 py-3 text-center text-body-sm font-semibold text-danger"
      >
        Переместить в архив
      </button>
    );
  }

  const handleConfirm = async () => {
    setError(null);
    setSubmitting(true);

    try {
      await archive(plant.id, status, reasonDetail.trim() || null);
      setShowForm(false);
    } catch {
      setError(ARCHIVE_FAILED_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
      <p className="mb-3 text-body-sm font-semibold text-text-primary">Причина архивации</p>
      <div className="mb-3 flex flex-col gap-2">
        {ARCHIVE_STATUS_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-body-sm text-text-primary"
          >
            <input
              type="radio"
              name="archive-status"
              checked={status === option.value}
              onChange={() => setStatus(option.value)}
              disabled={submitting}
              className="size-4 accent-accent"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <textarea
        placeholder="Подробности (необязательно): перелив, засуха, вредители..."
        value={reasonDetail}
        onChange={(event) => setReasonDetail(event.target.value)}
        disabled={submitting}
        className="mb-3 min-h-[72px] w-full rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-2.5 text-body-sm font-sans text-text-primary outline-none transition-shadow duration-100 focus:shadow-[var(--shadow-focus)]"
      />
      {error && <div className="mb-3 text-body-sm text-danger">{error}</div>}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="glass"
          onClick={() => setShowForm(false)}
          disabled={submitting}
          className="flex-1"
        >
          Отмена
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => void handleConfirm()}
          disabled={submitting}
          className="flex-1"
        >
          {submitting ? 'Сохраняем...' : 'Подтвердить'}
        </Button>
      </div>
    </div>
  );
};
