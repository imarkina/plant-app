import { useState, type FormEvent } from 'react';
import { ChipSelect } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import { Button } from '../../../shared/ui/components/Button/Button';
import { useLocationsContext } from '../hooks/useLocationsContext';
import type { LightLevel, WindowDirection } from '../models/location.types';
import { LIGHT_LEVEL_OPTIONS, WINDOW_DIRECTION_OPTIONS } from '../models/location-options';
import './LocationForm.css';

const NEW_SITE_OPTION = '__new__';
const SAVE_FAILED_MESSAGE = 'Не удалось сохранить локацию';

type Props = {
  onCreated?: () => void;
};

export const LocationForm = ({ onCreated }: Props) => {
  const { sites, createSite, createLocation } = useLocationsContext();

  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0]?.id ?? NEW_SITE_OPTION);
  const [newSiteName, setNewSiteName] = useState('');
  const [name, setName] = useState('');
  const [windowDirection, setWindowDirection] = useState<WindowDirection | null>(null);
  const [distanceFromWindowCm, setDistanceFromWindowCm] = useState('');
  const [lightLevel, setLightLevel] = useState<LightLevel | null>(null);
  const [hasGrowLight, setHasGrowLight] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreatingNewSite = selectedSiteId === NEW_SITE_OPTION;

  const resetFields = () => {
    setName('');
    setWindowDirection(null);
    setDistanceFromWindowCm('');
    setLightLevel(null);
    setHasGrowLight(false);
    setNewSiteName('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Введите название локации');
      return;
    }

    if (isCreatingNewSite && !newSiteName.trim()) {
      setError('Введите название дома/места');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const siteId = isCreatingNewSite ? (await createSite(newSiteName.trim())).id : selectedSiteId;

      await createLocation({
        siteId,
        name: name.trim(),
        windowDirection,
        distanceFromWindowCm: distanceFromWindowCm ? Number(distanceFromWindowCm) : null,
        lightLevel,
        hasGrowLight,
      });

      resetFields();
      onCreated?.();
    } catch {
      setError(SAVE_FAILED_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <label className="location-form__field">
        <span>Дом / место</span>
        <select
          value={selectedSiteId}
          onChange={(event) => setSelectedSiteId(event.target.value)}
          disabled={submitting}
        >
          {sites.map((site) => (
            <option key={site.id} value={site.id}>
              {site.name}
            </option>
          ))}
          <option value={NEW_SITE_OPTION}>+ Новое место</option>
        </select>
      </label>

      {isCreatingNewSite && (
        <label className="location-form__field">
          <span>Название нового места</span>
          <input
            type="text"
            value={newSiteName}
            onChange={(event) => setNewSiteName(event.target.value)}
            placeholder="Дом, Офис, Дача..."
            disabled={submitting}
          />
        </label>
      )}

      <label className="location-form__field">
        <span>Название комнаты</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Кухня, подоконник"
          disabled={submitting}
        />
      </label>

      <div className="location-form__field">
        <span>Направление окон</span>
        <ChipSelect
          options={WINDOW_DIRECTION_OPTIONS}
          value={windowDirection}
          onChange={setWindowDirection}
        />
      </div>

      <label className="location-form__field">
        <span>Расстояние до окна, см</span>
        <input
          type="number"
          min={0}
          value={distanceFromWindowCm}
          onChange={(event) => setDistanceFromWindowCm(event.target.value)}
          disabled={submitting}
        />
      </label>

      <div className="location-form__field">
        <span>Освещённость</span>
        <ChipSelect options={LIGHT_LEVEL_OPTIONS} value={lightLevel} onChange={setLightLevel} />
      </div>

      <label className="location-form__toggle">
        <input
          type="checkbox"
          checked={hasGrowLight}
          onChange={(event) => setHasGrowLight(event.target.checked)}
          disabled={submitting}
        />
        <span>Есть фитолампа</span>
      </label>

      {error && <div className="location-form__error">{error}</div>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? 'Сохраняем...' : 'Создать локацию'}
      </Button>
    </form>
  );
};
