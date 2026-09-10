import { useState } from 'react';
import { Droplet } from 'lucide-react';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { formatDate } from '../../../shared/helpers';

function nowLabel(): string {
  return formatDate(Date.now());
}

type Props = {
  open: boolean;
  plantName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export const WaterConfirmSheet = ({ open, plantName, onClose, onConfirm }: Props) => {
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="water-confirm-title">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-info/10 text-info">
          <Droplet size={26} />
        </div>
        <h2 id="water-confirm-title" className="mt-3 text-h3 text-text-primary">
          Полить «{plantName}»?
        </h2>
        <p className="mt-1 text-body-sm text-text-muted">{nowLabel()}</p>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="flex-1 cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3 text-button font-sans font-semibold text-text-primary disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={saving}
          className="flex-1 cursor-pointer rounded-2xl bg-brand px-4 py-3 text-button font-sans font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Сохраняем...' : 'Подтвердить'}
        </button>
      </div>
    </BottomSheet>
  );
};
