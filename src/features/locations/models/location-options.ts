import type { ChipOption } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import type { LightLevel } from './location.types';

export const LIGHT_LEVEL_OPTIONS: ChipOption<LightLevel>[] = [
  { value: 'direct', label: 'Прямой свет' },
  { value: 'bright_indirect', label: 'Рассеянный свет' },
  { value: 'low_light', label: 'Мало света' },
];

export function lightLevelLabel(value: LightLevel | null): string | null {
  return LIGHT_LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? null;
}
