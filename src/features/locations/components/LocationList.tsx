import { Trash2 } from 'lucide-react';
import { useLocationsContext } from '../hooks/useLocationsContext';
import { lightLevelLabel, windowDirectionLabel } from '../models/location-options';
import './LocationList.css';

const NO_DETAILS_LABEL = 'Параметры не указаны';

export const LocationList = () => {
  const { sites, locations, removeLocation } = useLocationsContext();

  if (locations.length === 0) {
    return <p className="location-list__empty">Локаций ещё нет — добавьте первую ниже</p>;
  }

  return (
    <div className="location-list">
      {sites.map((site) => {
        const siteLocations = locations.filter((location) => location.siteId === site.id);

        if (siteLocations.length === 0) {
          return null;
        }

        return (
          <div key={site.id}>
            <p className="location-list__site-name">{site.name}</p>
            {siteLocations.map((location) => {
              const details = [
                windowDirectionLabel(location.windowDirection),
                lightLevelLabel(location.lightLevel),
                location.hasGrowLight ? 'Фитолампа' : null,
              ]
                .filter((value): value is string => Boolean(value))
                .join(' · ');

              return (
                <div key={location.id} className="location-row">
                  <div className="location-row__info">
                    <p className="location-row__name">{location.name}</p>
                    <p className="location-row__meta">{details || NO_DETAILS_LABEL}</p>
                  </div>
                  <button
                    type="button"
                    className="location-row__delete"
                    onClick={() => void removeLocation(location.id)}
                    aria-label="Удалить локацию"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
