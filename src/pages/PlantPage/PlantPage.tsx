import { useParams } from 'react-router-dom';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { PlantPageContent } from './components/PlantPageContent';
import { PlantPageSkeleton } from './components/PlantPageSkeleton';

export const PlantPage = () => {
  const { id } = useParams();
  const { plants, loading } = usePlantsContext();

  const plant = plants.find((p) => p.id === id);

  if (loading) {
    return <PlantPageSkeleton />;
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
