import { useParams } from 'react-router-dom';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { PlantPageContent } from './components/PlantPageContent';

export const PlantPage = () => {
  const { id } = useParams();
  const { plants, loading } = usePlantsContext();

  const plant = plants.find((p) => p.id === id);

  if (loading) {
    return <p className="mt-6 text-body-sm text-text-muted">Загрузка...</p>;
  }

  if (!plant || !plant.photos[0]) {
    return (
      <div>
        <BackButton />
        <p className="text-body-sm text-text-muted">Растение не найдено.</p>
      </div>
    );
  }

  return <PlantPageContent plant={plant} />;
};
