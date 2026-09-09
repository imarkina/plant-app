import { Link } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import type { Plant } from '../models/plant.types';
import { healthBucketToDotClassName, healthStatusToBucket } from '../models/report-status.mappers';
import { formatDue, getCareStatus, getNextDue, type CareTask } from '../../care-tasks';
import { roomIcon } from '../../locations';

type Props = {
  plants: Plant[];
  locationNameById: Map<string, string>;
  careTasksByPlantId: Map<string, CareTask[]>;
};

export const PlantListView = ({ plants, locationNameById, careTasksByPlantId }: Props) => {
  if (plants.length === 0) {
    return <p className="mt-6 text-body-sm text-text-muted">Ничего не нашлось.</p>;
  }

  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {plants.map((plant) => {
        const photo = plant.photos[0];
        const analysis = photo?.analysis;
        const name = analysis?.identification.commonName ?? plant.name;
        const botanicalName = analysis?.identification.botanicalName;
        const roomName = plant.locationId ? locationNameById.get(plant.locationId) : undefined;
        const RoomIcon = roomName ? roomIcon(roomName) : null;

        const wateringTask = careTasksByPlantId
          .get(plant.id)
          ?.find((task) => task.type === 'watering');
        const wateringLabel = wateringTask ? formatDue(getNextDue(wateringTask)) : null;
        const isWateringOverdue = wateringTask ? getCareStatus(wateringTask) === 'overdue' : false;
        const dotClassName = analysis?.health.status
          ? healthBucketToDotClassName(healthStatusToBucket(analysis.health.status))
          : null;

        return (
          <Link
            key={plant.id}
            to={`/plant/${plant.id}`}
            className="flex items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-2.5 shadow-card backdrop-blur-xl backdrop-saturate-150 transition-transform duration-200 active:scale-[0.98]"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-bg-tertiary desktop:size-20">
              {photo?.imageUrl && (
                <img
                  src={photo.imageUrl}
                  alt={name}
                  className="absolute inset-0 size-full object-cover"
                />
              )}
              {dotClassName && (
                <span
                  className={`absolute top-1 right-1 size-2.5 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] ${dotClassName}`}
                />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-h4 text-text-primary">{name}</p>
              {botanicalName && (
                <p className="truncate text-body-sm text-text-muted italic">{botanicalName}</p>
              )}
              {roomName && RoomIcon && (
                <span className="mt-1 inline-flex items-center gap-1 truncate rounded-full bg-bg-tertiary px-2 py-0.5 text-caption text-text-secondary">
                  <RoomIcon size={11} />
                  {roomName}
                </span>
              )}
            </div>

            {wateringLabel && (
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-bg-tertiary px-2.5 py-1.5 text-caption font-medium ${
                  isWateringOverdue ? 'text-danger' : 'text-text-secondary'
                }`}
              >
                <Droplet size={12} />
                {wateringLabel}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};
