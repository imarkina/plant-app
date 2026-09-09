import { useState } from 'react';
import type { Plant, PhotoEntry } from '../models/plant.types';
import { AddPhotoSheet } from './AddPhotoSheet';
import { PhotoTimeline } from './PhotoTimeline';
import { PhotoLightbox } from './PhotoLightbox';
import { PlantComparison } from './PlantsComparison';
import { healthStatusToBucket } from '../models/report-status.mappers';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useCareTasks } from '../../care-tasks/hooks/useCareTasks';
import { useLocations } from '../../locations/hooks/useLocations';
import { pluralDays } from '../../../shared/helpers';

type Props = {
  plant: Plant;
};

const HEALTH_BADGE: Record<'healthy' | 'warning' | 'sick', { emoji: string; className: string }> = {
  healthy: { emoji: '🌿 Здорова', className: 'bg-accent-glow text-accent' },
  warning: { emoji: '⚠️ Внимание', className: 'bg-warn-soft text-warn' },
  sick: { emoji: '🚨 Болеет', className: 'bg-danger-soft text-danger' },
};

export const PlantTimelineView = ({ plant }: Props) => {
  const { locations } = useLocations();
  const { tasks } = useCareTasks(plant.id);
  const { deletePhoto } = usePlantsContext();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<PhotoEntry | null>(null);

  const sortedPhotos = [...plant.photos].sort((a, b) => a.createdAt - b.createdAt);
  const latestPhoto = sortedPhotos[sortedPhotos.length - 1];
  const name = latestPhoto?.analysis?.identification.commonName ?? plant.name;
  const location = locations.find((l) => l.id === plant.locationId);
  const wateringTask = tasks.find((task) => task.type === 'watering');
  const bucket = latestPhoto?.analysis?.health.status
    ? healthStatusToBucket(latestPhoto.analysis.health.status)
    : null;

  const infoLine = [
    location?.name,
    wateringTask
      ? `Полив: раз в ${wateringTask.intervalDays} ${pluralDays(wateringTask.intervalDays)}`
      : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const handleDeleteZoomedPhoto = () => {
    if (zoomedPhoto) {
      void deletePhoto(plant.id, zoomedPhoto.id);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 rounded-3xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl">
        <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-bg-tertiary">
          {latestPhoto?.imageUrl && (
            <img src={latestPhoto.imageUrl} alt="" className="size-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-h4 text-text-primary">{name}</p>
          {infoLine && <p className="mt-0.5 truncate text-caption text-text-muted">{infoLine}</p>}
        </div>
        {bucket && (
          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-caption font-semibold ${HEALTH_BADGE[bucket].className}`}
          >
            {HEALTH_BADGE[bucket].emoji}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-h3 text-text-primary">История фото</p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white shadow-card active:scale-[0.97]"
        >
          📷 Добавить
        </button>
      </div>

      {sortedPhotos.length < 2 && (
        <p className="mt-2 text-body-sm text-text-muted">
          Сделайте фото раз в неделю, чтобы увидеть рост!
        </p>
      )}

      {sortedPhotos.length >= 2 && (
        <div className="mt-4">
          <PlantComparison first={sortedPhotos[0]} last={sortedPhotos[sortedPhotos.length - 1]} />
        </div>
      )}

      <PhotoTimeline photos={sortedPhotos} onZoom={setZoomedPhoto} />

      <AddPhotoSheet
        plant={plant}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdded={() => {}}
      />

      {zoomedPhoto && (
        <PhotoLightbox
          photo={zoomedPhoto}
          onClose={() => setZoomedPhoto(null)}
          onDelete={handleDeleteZoomedPhoto}
        />
      )}
    </div>
  );
};
