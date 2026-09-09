import { type ChangeEvent, useState } from 'react';
import { RotateCw } from 'lucide-react';
import type { Plant, PhotoType } from '../models/plant.types';
import { useAddPhoto } from '../hooks/useAddPhoto';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { cropToSquare, rotateImage90 } from '../../../shared/image/resize';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ADD_PHOTO_MAX_SIDE = 1200;

const PHOTO_TYPES: { value: PhotoType; emoji: string; title: string; subtitle: string }[] = [
  { value: 'growth', emoji: '🌿', title: 'Рост', subtitle: 'Обычное фото для таймлайна' },
  { value: 'purchase', emoji: '🌱', title: 'Покупка', subtitle: 'Фото в день покупки' },
  { value: 'diagnosis', emoji: '🩺', title: 'Диагноз', subtitle: 'Проблема с растением' },
  { value: 'archive', emoji: '📁', title: 'Архив', subtitle: 'Просто для коллекции' },
];

type Props = {
  plant: Plant;
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
};

export const AddPhotoSheet = ({ plant, open, onClose, onAdded }: Props) => {
  const { addPhotoFromFile, loading } = useAddPhoto(plant.id);
  const [selectedType, setSelectedType] = useState<PhotoType>('growth');
  const [squareCrop, setSquareCrop] = useState(true);
  const [pendingBlob, setPendingBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);

  const setPending = (blob: Blob | null) => {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return blob ? URL.createObjectURL(blob) : null;
    });
    setPendingBlob(blob);
  };

  const handleClose = () => {
    setPending(null);
    setSizeError(null);
    onClose();
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setSizeError('Файл больше 10 МБ — выбери фото поменьше или сожми его перед загрузкой.');
      return;
    }

    setSizeError(null);
    setPending(squareCrop ? await cropToSquare(file) : file);
  };

  const handleRotate = async () => {
    if (!pendingBlob) {
      return;
    }
    setPending(await rotateImage90(pendingBlob));
  };

  const handleRetake = () => setPending(null);

  const handleConfirm = async () => {
    if (!pendingBlob) {
      return;
    }

    await addPhotoFromFile(pendingBlob, selectedType, ADD_PHOTO_MAX_SIDE);
    setPending(null);
    onAdded();
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={handleClose} labelledBy="add-photo-title">
      <h2 id="add-photo-title" className="text-h2 text-text-primary">
        📸 Добавить фото
      </h2>
      <p className="mt-1 text-body-sm text-text-muted">Выбери тип фото для {plant.name}</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {PHOTO_TYPES.map((option) => {
          const isActive = option.value === selectedType;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedType(option.value)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-colors duration-100 ${
                isActive
                  ? 'border-brand-pink bg-surface-glass'
                  : 'border-surface-glass-border bg-bg-elevated'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span className="text-body-sm font-semibold text-text-primary">{option.title}</span>
              <span className="text-caption text-text-muted">{option.subtitle}</span>
            </button>
          );
        })}
      </div>

      {!pendingBlob ? (
        <>
          <label className="mt-4 flex items-center justify-between rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3">
            <span className="text-body-sm font-medium text-text-primary">Обрезать до квадрата</span>
            <input
              type="checkbox"
              checked={squareCrop}
              onChange={(event) => setSquareCrop(event.target.checked)}
              className="size-5 accent-brand-pink"
            />
          </label>

          {sizeError && <p className="mt-3 text-body-sm text-danger">{sizeError}</p>}

          <label className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3.5 text-button font-sans text-white shadow-fab active:scale-[0.98]">
            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            📷 Сделать фото
          </label>
        </>
      ) : (
        <>
          <div className="relative mt-4 overflow-hidden rounded-2xl bg-bg-tertiary">
            {previewUrl && <img src={previewUrl} alt="" className="max-h-80 w-full object-contain" />}
            <button
              type="button"
              onClick={handleRotate}
              aria-label="Повернуть на 90°"
              className="absolute top-2 right-2 flex size-9 cursor-pointer items-center justify-center rounded-full bg-bg-elevated/90 text-text-primary shadow-card backdrop-blur-xl"
            >
              <RotateCw size={16} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleRetake}
              className="cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-4 py-3 text-body-sm font-semibold text-text-primary"
            >
              Переснять
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={loading}
              className="cursor-pointer rounded-2xl bg-brand px-4 py-3 text-body-sm font-semibold text-white shadow-fab disabled:pointer-events-none disabled:opacity-40"
            >
              {loading ? 'Сохраняем...' : 'Сохранить'}
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  );
};
