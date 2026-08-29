import { useState } from 'react';
import type { ArchiveStatus, Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { Button } from '../../../shared/ui/components/Button/Button';
import './PlantArchiveSection.css';

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
      <div className="plant-archive plant-archive--archived">
        <p className="plant-archive__status">
          В архиве{statusLabel ? `: ${statusLabel}` : ''}
          {plant.archiveReasonDetail ? ` — ${plant.archiveReasonDetail}` : ''}
        </p>
        {error && <div className="plant-archive__error">{error}</div>}
        <Button
          type="button"
          variant="secondary"
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
      <button type="button" className="plant-archive__trigger" onClick={() => setShowForm(true)}>
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
    <div className="plant-archive">
      <p className="plant-archive__label">Причина архивации</p>
      <div className="plant-archive__options">
        {ARCHIVE_STATUS_OPTIONS.map((option) => (
          <label key={option.value} className="plant-archive__option">
            <input
              type="radio"
              name="archive-status"
              checked={status === option.value}
              onChange={() => setStatus(option.value)}
              disabled={submitting}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      <textarea
        className="plant-archive__detail"
        placeholder="Подробности (необязательно): перелив, засуха, вредители..."
        value={reasonDetail}
        onChange={(event) => setReasonDetail(event.target.value)}
        disabled={submitting}
      />
      {error && <div className="plant-archive__error">{error}</div>}
      <div className="plant-archive__actions">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowForm(false)}
          disabled={submitting}
        >
          Отмена
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={() => void handleConfirm()}
          disabled={submitting}
        >
          {submitting ? 'Сохраняем...' : 'Подтвердить'}
        </Button>
      </div>
    </div>
  );
};
