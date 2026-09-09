import { BackButton } from '../../../shared/ui/components/BackButton/BackButton';
import { PlantPreview } from '../../../features/plants/components/PlantPreview';
import { PlantDetailTabs } from '../../../features/plants/components/PlantDetailTabs';
import type { Plant } from '../../../features/plants/models/plant.types';

type Props = {
  plant: Plant;
};

export const PlantPageContent = ({ plant }: Props) => {
  return (
    <div style={{ paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <BackButton />
      {plant.photos[0].imageUrl && <PlantPreview previewUrl={plant.photos[0].imageUrl} />}
      <PlantDetailTabs plant={plant} />
    </div>
  );
};
