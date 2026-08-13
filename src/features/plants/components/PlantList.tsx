import type { Plant } from '../models/plant.types';
import { usePhotoUrls } from '../hooks/usePhotoUrls';

type Props = {
  plants: Plant[];
};

export const PlantList = ({ plants }: Props) => {
  const urls = usePhotoUrls(plants);

  return (
    <div>
      {plants.map((plant) => {
        return (
          <div key={plant.id}>
            <p>Имя файла: {plant.name}</p>
            {urls[plant.id] && <img src={urls[plant.id]} alt={plant.name} />}
          </div>
        );
      })}
    </div>
  );
};
