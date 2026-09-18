import { useState, type FormEvent } from 'react';
import { ChipSelect } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import { Button } from '../../../shared/ui/components/Button/Button';
import { useLocationsContext } from '../hooks/useLocationsContext';
import type { LightLevel } from '../models/location.types';
import { LIGHT_LEVEL_OPTIONS } from '../models/location-options';
import './LocationForm.css';

const SAVE_FAILED_MESSAGE = 'Не удалось сохранить локацию';

type Props = {
  onCreated?: () => void;
};

export const LocationForm = ({ onCreated }: Props) => {
  const { createLocation } = useLocationsContext();

  const [name, setName] = useState('');
  const [lightLevel, setLightLevel] = useState<LightLevel | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetFields = () => {
    setName('');
    setLightLevel(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Введите название локации');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createLocation({
        name: name.trim(),
        lightLevel,
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
    <form className="location-form" onSubmit={(event) => void handleSubmit(event)}>
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
        <span>Освещённость</span>
        <ChipSelect options={LIGHT_LEVEL_OPTIONS} value={lightLevel} onChange={setLightLevel} />
      </div>

      {error && <div className="location-form__error">{error}</div>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? 'Сохраняем...' : 'Создать локацию'}
      </Button>
    </form>
  );
};
