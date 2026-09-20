import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
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
        <p className="text-body-sm text-text-muted">Загрузка...</p>
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
