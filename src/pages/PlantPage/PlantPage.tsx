import { useParams } from 'react-router-dom';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { PlantPageContent } from './components/PlantPageContent';

export const PlantPage = () => {
  const { id } = useParams();
  const { plants, loading } = usePlantsContext();

  const plant = plants.find((p) => p.id === id);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!plant || !plant.photos[0]) {
    return <p>Не найдено...</p>;
  }

  return <PlantPageContent plant={plant} />;
};
