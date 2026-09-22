import { useState } from 'react';
import type { Plant } from '../models/plant.types';
import { ARCHIVE_STATUS_OPTIONS } from '../models/archive-options';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { Button } from '../../../shared/ui/components/Button/Button';
import { emitToast } from '../../../shared/ui/toast/toastBus';

const RESTORE_FAILED_MESSAGE = 'Не удалось восстановить растение';

type Props = {
  plant: Plant;
};

/** Рендерится только для уже архивных растений (см. вызов в PlantSettingsTab) — причину архивации спрашивает DeletePlantSheet перед архивацией. */
export const PlantArchiveSection = ({ plant }: Props) => {
  const { restore } = usePlantsContext();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusLabel = ARCHIVE_STATUS_OPTIONS.find(
    (option) => option.value === plant.archiveStatus,
  )?.label;

  const handleRestore = async () => {
    setError(null);
    setSubmitting(true);

    try {
      await restore(plant.id);
      emitToast(`«${plant.name}» возвращено в коллекцию 🌿`, 'success');
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
      <Button type="button" variant="glass" onClick={() => void handleRestore()} disabled={submitting}>
        {submitting ? 'Восстанавливаем...' : 'Восстановить'}
      </Button>
    </div>
  );
};
