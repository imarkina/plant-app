import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useLocations } from '../../locations/hooks/useLocations';
import { PlantProfileTab } from './PlantProfileTab';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { emitToast } from '../../../shared/ui/toast/toastBus';

type Props = {
  plant: Plant;
};

const SettingsRow = ({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <div className="min-w-0">
        <p className="text-caption text-text-muted">{label}</p>
        <p className="mt-0.5 truncate text-body-sm font-semibold text-text-primary">{value}</p>
      </div>
      {onClick && <ChevronRight size={16} className="shrink-0 text-text-muted" />}
    </>
  );

  if (!onClick) {
    return <div className="flex items-center justify-between py-3">{content}</div>;
  }

  return (
    <button type="button" onClick={onClick} className="flex w-full cursor-pointer items-center justify-between py-3 text-left">
      {content}
    </button>
  );
};

const MoveToRoomSheet = ({
  plant,
  open,
  onClose,
}: {
  plant: Plant;
  open: boolean;
  onClose: () => void;
}) => {
  const { locations } = useLocations();
  const { updateProfile } = usePlantsContext();
  const [locationId, setLocationId] = useState(plant.locationId ?? '');
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      await updateProfile(plant.id, { locationId: locationId || null });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="move-room-title">
      <h2 id="move-room-title" className="text-h3 text-text-primary">
        Перенести в другую комнату
      </h2>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setLocationId('')}
          className={`cursor-pointer rounded-2xl border px-4 py-3 text-left text-body-sm font-semibold ${
            locationId === '' ? 'border-accent bg-accent-glow text-accent' : 'border-surface-glass-border text-text-primary'
          }`}
        >
          Без комнаты
        </button>
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => setLocationId(location.id)}
            className={`cursor-pointer rounded-2xl border px-4 py-3 text-left text-body-sm font-semibold ${
              locationId === location.id
                ? 'border-accent bg-accent-glow text-accent'
                : 'border-surface-glass-border text-text-primary'
            }`}
          >
            {location.name}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => void handleConfirm()}
        disabled={saving}
        className="mt-5 w-full cursor-pointer rounded-2xl bg-brand px-4 py-3 text-button font-sans font-semibold text-white disabled:opacity-50"
      >
        {saving ? 'Сохраняем...' : 'Перенести'}
      </button>
    </BottomSheet>
  );
};

const DeletePlantSheet = ({
  plant,
  open,
  onClose,
}: {
  plant: Plant;
  open: boolean;
  onClose: () => void;
}) => {
  const { deletePlant } = usePlantsContext();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleHardDelete = async () => {
    setBusy(true);
    try {
      await deletePlant(plant.id);
      onClose();
      void navigate('/collection');
      emitToast(`«${plant.name}» удалено безвозвратно`, 'success');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="delete-plant-title">
      <h2 id="delete-plant-title" className="text-h3 text-text-primary">
        Удалить «{plant.name}» из коллекции?
      </h2>
      <p className="mt-2 text-body-sm text-text-muted">
        Фото, история ухода и все данные растения будут удалены безвозвратно — отменить это
        действие нельзя.
      </p>
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 cursor-pointer rounded-2xl border border-surface-glass-border bg-surface-glass px-4 py-3 text-button font-sans font-semibold text-text-primary shadow-md backdrop-blur-xl backdrop-saturate-150"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={() => void handleHardDelete()}
          disabled={busy}
          className="flex-1 cursor-pointer rounded-2xl border border-danger/25 bg-danger-soft px-4 py-3 text-button font-sans font-semibold text-danger disabled:opacity-50"
        >
          {busy ? 'Удаляем...' : 'Удалить навсегда'}
        </button>
      </div>
    </BottomSheet>
  );
};

export const PlantSettingsTab = ({ plant }: Props) => {
  const { locations } = useLocations();
  const [editOpen, setEditOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const roomName = locations.find((location) => location.id === plant.locationId)?.name ?? 'Без комнаты';
  const scientificName = plant.photos[0]?.analysis?.identification.botanicalName ?? 'Неизвестно';

  return (
    <div className="mt-6">
      <p className="text-label text-text-muted uppercase">Основное</p>
      <div className="mt-1 rounded-3xl border border-surface-glass-border bg-surface-glass px-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
        <div className="divide-y divide-surface-glass-border">
          <SettingsRow label="Имя растения" value={plant.name} />
          <SettingsRow label="Комната" value={roomName} />
          <SettingsRow label="Научное название" value={scientificName} />
        </div>
      </div>

      <p className="mt-6 text-label text-text-muted uppercase">Действия</p>
      <div className="mt-1 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3 text-body-sm font-semibold text-text-primary shadow-card"
        >
          <Pencil size={16} className="text-text-secondary" /> Редактировать профиль
        </button>
        <button
          type="button"
          onClick={() => setMoveOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3 text-body-sm font-semibold text-text-primary shadow-card"
        >
          <RotateCcw size={16} /> Перенести в другую комнату
        </button>
      </div>

      <p className="mt-6 text-label text-text-muted uppercase">Опасная зона</p>
      <div className="mt-1 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-danger-soft bg-danger-soft px-4 py-3 text-body-sm font-semibold text-danger"
        >
          <Trash2 size={16} /> Удалить растение навсегда
        </button>
      </div>

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} labelledBy="edit-plant-title">
        <h2 id="edit-plant-title" className="mb-4 text-h3 text-text-primary">
          Редактировать профиль
        </h2>
        <PlantProfileTab plant={plant} />
      </BottomSheet>

      <MoveToRoomSheet plant={plant} open={moveOpen} onClose={() => setMoveOpen(false)} />
      <DeletePlantSheet plant={plant} open={deleteOpen} onClose={() => setDeleteOpen(false)} />
    </div>
  );
};
