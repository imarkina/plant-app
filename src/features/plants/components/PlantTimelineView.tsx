import { type ChangeEvent } from 'react';
import { useAddPhoto } from '../hooks/useAddPhoto';
import { UploadZone } from '../../../shared/ui/components/UploadZone/UploadZone';
import type { Plant } from '../models/plant.types';
import { Badge } from '../../../shared/ui/components/Badge/Badge';
import { statusToVariant } from '../models/report-status.mappers';
import { formatDate } from '../../../shared/helpers';
import './PlantTimelineView.css';
import { PlantComparison } from './PlantsComparison';

type Props = {
  plant: Plant;
};

export const PlantTimelineView = ({ plant }: Props) => {
  const { addPhotoFromFile, loading } = useAddPhoto(plant.id);

  const sortedPhotos = [...plant.photos].sort((a, b) => a.createdAt - b.createdAt);

  const handleAddPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await addPhotoFromFile(file);
    }
  };

  return (
    <div>
      <UploadZone
        loading={loading}
        onFileSelect={handleAddPhoto}
        title="Добавить фото в историю"
        subtitle="Отследим изменения"
      />
      {sortedPhotos.length === 1 && (
        <p className="timeline-empty-hint">Добавьте ещё фото, чтобы отслеживать изменения</p>
      )}
      <PlantComparison photos={sortedPhotos} />
      <div className="timeline">
        {sortedPhotos.map((photo) => (
          <div key={photo.id} className="timeline-item">
            {photo.imageUrl && <img src={photo.imageUrl} alt="" className="timeline-item__photo" />}
            <div className="timeline-item__info">
              <p className="timeline-item__date">{formatDate(photo.createdAt)}</p>
              {photo.analysis?.health?.status && (
                <Badge variant={statusToVariant(photo.analysis.health.status)}>
                  {photo.analysis.health.status}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
