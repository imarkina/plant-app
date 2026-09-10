import { PlantDetailTabs } from '../../../features/plants/components/PlantDetailTabs';
import type { Plant } from '../../../features/plants/models/plant.types';

type Props = {
  plant: Plant;
};

export const PlantPageContent = ({ plant }: Props) => {
  return (
    <div className="pb-20">
      <PlantDetailTabs plant={plant} />
    </div>
  );
};
