import { useState, type FormEvent } from 'react';
import type { Plant, PotType, SubstrateType } from '../models/plant.types';
import { usePlantsContext } from '../hooks/usePlantsContext';
import { useLocations } from '../../locations/hooks/useLocations';
import { useSpecies } from '../../species';
import { ChipSelect, type ChipOption } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import { Button } from '../../../shared/ui/components/Button/Button';
import './PlantProfileTab.css';

const POT_TYPE_OPTIONS: ChipOption<PotType>[] = [
  { value: 'plastic', label: 'Пластик' },
  { value: 'terracotta', label: 'Терракота' },
  { value: 'ceramic_glazed', label: 'Керамика (глазурь)' },
  { value: 'self_watering', label: 'Автополив' },
];

const SUBSTRATE_TYPE_OPTIONS: ChipOption<SubstrateType>[] = [
  { value: 'standard', label: 'Стандартный' },
  { value: 'aroid_mix', label: 'Ароидный микс' },
  { value: 'mineral', label: 'Минеральный' },
  { value: 'other', label: 'Другое' },
];

const NO_LOCATION_OPTION = '';
const NO_SPECIES_OPTION = '';
const SAVE_FAILED_MESSAGE = 'Не удалось сохранить профиль';

type Props = {
  plant: Plant;
};

export const PlantProfileTab = ({ plant }: Props) => {
  const { updateProfile } = usePlantsContext();
  const { locations, loading: locationsLoading } = useLocations();
  const { species, loading: speciesLoading } = useSpecies();

  const [name, setName] = useState(plant.name);
  const [locationId, setLocationId] = useState(plant.locationId ?? NO_LOCATION_OPTION);
  const [speciesId, setSpeciesId] = useState(plant.speciesId ?? NO_SPECIES_OPTION);
  const [customSpeciesName, setCustomSpeciesName] = useState(plant.customSpeciesName ?? '');
  const [purchasedAt, setPurchasedAt] = useState(plant.purchasedAt ?? '');
  const [potType, setPotType] = useState<PotType | null>(plant.potType);
  const [potDiameterCm, setPotDiameterCm] = useState(
    plant.potDiameterCm != null ? String(plant.potDiameterCm) : '',
  );
  const [hasDrainage, setHasDrainage] = useState(Boolean(plant.hasDrainage));
  const [substrateType, setSubstrateType] = useState<SubstrateType | null>(plant.substrateType);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedJustNow, setSavedJustNow] = useState(false);

  const handleSpeciesSelect = (value: string) => {
    setSpeciesId(value);
    if (value) {
      setCustomSpeciesName('');
    }
  };

  const handleCustomSpeciesChange = (value: string) => {
    setCustomSpeciesName(value);
    if (value) {
      setSpeciesId(NO_SPECIES_OPTION);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSavedJustNow(false);
    setSaving(true);

    try {
      await updateProfile(plant.id, {
        name: name.trim() || plant.name,
        locationId: locationId || null,
        speciesId: speciesId || null,
        customSpeciesName: customSpeciesName.trim() || null,
        purchasedAt: purchasedAt || null,
        potType,
        potDiameterCm: potDiameterCm ? Number(potDiameterCm) : null,
        hasDrainage,
        substrateType,
      });
      setSavedJustNow(true);
    } catch {
      setError(SAVE_FAILED_MESSAGE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="plant-profile" onSubmit={handleSubmit}>
      <label className="plant-profile__field">
        <span>Кличка</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
        />
      </label>

      <label className="plant-profile__field">
        <span>Локация</span>
        <select
          value={locationId}
          onChange={(event) => setLocationId(event.target.value)}
          disabled={saving || locationsLoading}
        >
          <option value={NO_LOCATION_OPTION}>Не выбрано</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </label>

      {species.length > 0 && (
        <label className="plant-profile__field">
          <span>Вид из справочника</span>
          <select
            value={speciesId}
            onChange={(event) => handleSpeciesSelect(event.target.value)}
            disabled={saving || speciesLoading}
          >
            <option value={NO_SPECIES_OPTION}>Не выбрано</option>
            {species.map((item) => (
              <option key={item.id} value={item.id}>
                {item.commonName}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="plant-profile__field">
        <span>Своё название вида</span>
        <input
          type="text"
          value={customSpeciesName}
          onChange={(event) => handleCustomSpeciesChange(event.target.value)}
          placeholder="Если вида нет в справочнике"
          disabled={saving}
        />
      </label>

      <label className="plant-profile__field">
        <span>Дата покупки</span>
        <input
          type="date"
          value={purchasedAt}
          onChange={(event) => setPurchasedAt(event.target.value)}
          disabled={saving}
        />
      </label>

      <div className="plant-profile__field">
        <span>Тип горшка</span>
        <ChipSelect options={POT_TYPE_OPTIONS} value={potType} onChange={setPotType} />
      </div>

      <label className="plant-profile__field">
        <span>Диаметр горшка, см</span>
        <input
          type="number"
          min={0}
          value={potDiameterCm}
          onChange={(event) => setPotDiameterCm(event.target.value)}
          disabled={saving}
        />
      </label>

      <label className="plant-profile__toggle">
        <input
          type="checkbox"
          checked={hasDrainage}
          onChange={(event) => setHasDrainage(event.target.checked)}
          disabled={saving}
        />
        <span>Есть дренаж</span>
      </label>

      <div className="plant-profile__field">
        <span>Грунт</span>
        <ChipSelect
          options={SUBSTRATE_TYPE_OPTIONS}
          value={substrateType}
          onChange={setSubstrateType}
        />
      </div>

      {error && <div className="plant-profile__error">{error}</div>}
      {savedJustNow && <div className="plant-profile__success">Сохранено</div>}

      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? 'Сохраняем...' : 'Сохранить'}
      </Button>
    </form>
  );
};
