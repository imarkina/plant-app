import { useState } from 'react';
import type { Plant, PhotoEntry } from '../models/plant.types';
import { AddPhotoSheet } from './AddPhotoSheet';
import { PhotoTimeline } from './PhotoTimeline';
import { PhotoLightbox } from './PhotoLightbox';
import { PlantComparison } from './PlantsComparison';
import { usePlantsContext } from '../hooks/usePlantsContext';

type Props = {
  plant: Plant;
};

export const PlantTimelineView = ({ plant }: Props) => {
  const { deletePhoto } = usePlantsContext();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<PhotoEntry | null>(null);

  const sortedPhotos = [...plant.photos].sort((a, b) => a.createdAt - b.createdAt);

  const handleDeleteZoomedPhoto = () => {
    if (zoomedPhoto) {
      void deletePhoto(plant.id, zoomedPhoto.id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-h3 text-text-primary">История фото</p>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white shadow-fab active:scale-[0.97]"
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
