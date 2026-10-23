import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { Skeleton } from '../../shared/ui/components/Skeleton/Skeleton';
import {
  LocationForm,
  LocationList,
  LocationsProvider,
  useLocationsContext,
} from '../../features/locations';

const LocationsPageContent = () => {
  const { loading } = useLocationsContext();

  if (loading) {
    return (
      <div>
        <BackButton />
        <Skeleton className="h-8 w-40" />
        <div className="mt-4 flex flex-col gap-2.5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackButton />
      <h1 className="text-h1 desktop:text-h1-lg text-text-primary">Локации</h1>
      <LocationList />
      <h2 className="mt-8 mb-4 text-h3 desktop:text-h3-lg text-text-primary">Добавить локацию</h2>
      <LocationForm />
    </div>
  );
};

export const LocationsPage = () => (
  <LocationsProvider>
    <LocationsPageContent />
  </LocationsProvider>
);
