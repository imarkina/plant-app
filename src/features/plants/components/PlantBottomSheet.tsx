import { type ChangeEvent, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import type { Location } from '../../locations';
import { windowDirectionPhrase } from '../../locations';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { PlantDetailTabs } from './PlantDetailTabs';
import { useCareTasks } from '../../care-tasks/hooks/useCareTasks';
import { useAddPhoto } from '../hooks/useAddPhoto';
import { formatInterval } from '../../../shared/helpers';

type Props = {
  plant: Plant;
  open: boolean;
  locations: Location[];
  onClose: () => void;
};

const photoDate = (ts: number) =>
  new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

/**
 * Родитель должен держать `plant` последним выбранным значением (не обнулять
 * его при закрытии), иначе контент исчезнет раньше, чем доиграет анимация
 * BottomSheet.
 */
export const PlantBottomSheet = ({ plant, open, locations, onClose }: Props) => {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const detailRef = useRef<HTMLDivElement>(null);

  const careTasks = useCareTasks(plant.id);
  const { addPhotoFromFile } = useAddPhoto(plant.id);

  const photo = plant.photos[0];
  const analysis = photo?.analysis;
  const name = analysis?.identification.commonName ?? plant.name;
  const botanicalName = analysis?.identification.botanicalName;
  const location = locations.find((l) => l.id === plant.locationId);
  const windowPhrase = location ? windowDirectionPhrase(location.windowDirection) : null;

  const wateringTask = careTasks.tasks.find((task) => task.type === 'watering');

  const handleWater = () => {
    if (wateringTask) {
      void careTasks.markDone(wateringTask.id);
      return;
    }
    setActiveTab('care');
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePhotoAdd = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await addPhotoFromFile(file);
    }
    event.target.value = '';
  };

  const handleDiagnosis = () => {
    setActiveTab('diagnosis');
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const subtitle = [botanicalName, location?.name, windowPhrase].filter(Boolean).join(' · ');

  return (
    <BottomSheet open={open} onClose={onClose} labelledBy="plant-sheet-title">
      <div className="relative -mx-4 -mt-1 mb-4 aspect-[16/11] overflow-hidden">
        {photo?.imageUrl && (
          <img src={photo.imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full bg-bg-elevated/90 text-text-primary shadow-card backdrop-blur-xl"
        >
          <X size={18} />
        </button>
      </div>

      <h2 id="plant-sheet-title" className="text-h1 text-text-primary">
        {name}
      </h2>
      {subtitle && <p className="mt-1 text-body-sm text-text-muted italic">{subtitle}</p>}

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-3 text-center shadow-card backdrop-blur-xl">
          <p className="text-h3">💧</p>
          <p className="mt-1 text-h4 text-text-primary">
            {wateringTask ? formatInterval(wateringTask.intervalDays) : '—'}
          </p>
          <p className="text-caption text-text-muted">Интервал</p>
        </div>
        <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-3 text-center shadow-card backdrop-blur-xl">
          <p className="text-h3">☀️</p>
          <p className="mt-1 truncate text-h4 text-text-primary">
            {analysis?.carePassport.lighting.summary ?? '—'}
          </p>
          <p className="text-caption text-text-muted">Свет</p>
        </div>
        <div className="rounded-2xl border border-surface-glass-border bg-surface-glass p-3 text-center shadow-card backdrop-blur-xl">
          <p className="text-h3">💦</p>
          <p className="mt-1 truncate text-h4 text-text-primary">
            {analysis?.carePassport.environment.humidity ?? '—'}
          </p>
          <p className="text-caption text-text-muted">Влажность</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleWater}
          className="cursor-pointer rounded-2xl bg-brand px-3 py-3 text-body-sm font-semibold text-white shadow-card active:scale-[0.97]"
        >
          💧 Полить
        </button>
        <label className="cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-center text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]">
          <input type="file" accept="image/*" onChange={handlePhotoAdd} className="hidden" />
          📷 Фото
        </label>
        <button
          type="button"
          onClick={handleDiagnosis}
          className="cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]"
        >
          🩺 Диагноз
        </button>
      </div>

      {plant.photos.length > 0 && (
        <div className="mt-5">
          <p className="text-label text-text-muted uppercase">📷 Фотоальбом</p>
          <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
            {plant.photos.map((entry) => (
              <div key={entry.id} className="shrink-0 text-center">
                <div className="size-16 overflow-hidden rounded-xl bg-bg-tertiary shadow-card">
                  {entry.imageUrl && (
                    <img src={entry.imageUrl} alt="" className="size-full object-cover" />
                  )}
                </div>
                <p className="mt-1 text-caption text-text-muted">{photoDate(entry.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div ref={detailRef} className="mt-6 scroll-mt-4">
        <PlantDetailTabs plant={plant} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </BottomSheet>
  );
};
