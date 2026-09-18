import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useLocations } from '../../locations/hooks/useLocations';
import { PlantProfileTab } from './PlantProfileTab';
import { PlantArchiveSection } from './PlantArchiveSection';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';

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
            locationId === '' ? 'border-brand bg-brand/10 text-brand-pink' : 'border-surface-glass-border text-text-primary'
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
                ? 'border-brand bg-brand/10 text-brand-pink'
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

type DeleteStep = 'confirm' | 'choose-archive';

const DeletePlantSheet = ({
  plant,
  open,
  onClose,
}: {
  plant: Plant;
  open: boolean;
  onClose: () => void;
}) => {
  const { archive, deletePlant } = usePlantsContext();
  const navigate = useNavigate();
  const [step, setStep] = useState<DeleteStep>('confirm');
  const [busy, setBusy] = useState(false);

  const handleClose = () => {
    setStep('confirm');
    onClose();
  };

  const handleArchiveInstead = async () => {
    setBusy(true);
    try {
      await archive(plant.id, 'other', null);
      handleClose();
    } finally {
      setBusy(false);
    }
  };

  const handleHardDelete = async () => {
    setBusy(true);
    try {
      await deletePlant(plant.id);
      handleClose();
      void navigate('/collection');
    } finally {
      setBusy(false);
    }
  };

  return (
    <BottomSheet open={open} onClose={handleClose} labelledBy="delete-plant-title">
      {step === 'confirm' ? (
        <>
          <h2 id="delete-plant-title" className="text-h3 text-text-primary">
            Удалить «{plant.name}» из коллекции?
          </h2>
          <p className="mt-2 text-body-sm text-text-muted">
            Растение пропадёт из активной коллекции. На следующем шаге выберешь — сохранить фото и
            историю в архив, или удалить всё безвозвратно.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3 text-button font-sans font-semibold text-text-primary"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => setStep('choose-archive')}
              className="flex-1 cursor-pointer rounded-2xl bg-danger px-4 py-3 text-button font-sans font-semibold text-white"
            >
              Удалить
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-h3 text-text-primary">Сохранить фото и историю в архив?</h2>
          <p className="mt-2 text-body-sm text-text-muted">
            Архив можно восстановить в любой момент из настроек. Полное удаление необратимо.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void handleArchiveInstead()}
              disabled={busy}
              className="cursor-pointer rounded-2xl bg-brand px-4 py-3 text-button font-sans font-semibold text-white disabled:opacity-50"
            >
              {busy ? 'Сохраняем...' : 'Да, сохранить в архив'}
            </button>
            <button
              type="button"
              onClick={() => void handleHardDelete()}
              disabled={busy}
              className="cursor-pointer rounded-2xl border border-danger-soft bg-danger-soft px-4 py-3 text-button font-sans font-semibold text-danger disabled:opacity-50"
            >
              {busy ? 'Удаляем...' : 'Нет, удалить всё безвозвратно'}
            </button>
          </div>
        </>
      )}
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

  if (plant.isArchived) {
    return (
      <div className="mt-6">
        <PlantArchiveSection plant={plant} />
      </div>
    );
  }

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

      <p className="mt-6 text-label text-text-muted uppercase">Опасная зона</p>
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
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-danger-soft bg-danger-soft px-4 py-3 text-body-sm font-semibold text-danger"
        >
          <Trash2 size={16} /> Удалить растение из коллекции
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
