import type { ChipOption } from '../../../shared/ui/components/ChipSelect/ChipSelect';
import type { LightLevel, WindowDirection } from './location.types';

export const WINDOW_DIRECTION_OPTIONS: ChipOption<WindowDirection>[] = [
  { value: 'N', label: 'Север' },
  { value: 'S', label: 'Юг' },
  { value: 'E', label: 'Восток' },
  { value: 'W', label: 'Запад' },
];

export const LIGHT_LEVEL_OPTIONS: ChipOption<LightLevel>[] = [
  { value: 'direct', label: 'Прямой свет' },
  { value: 'bright_indirect', label: 'Рассеянный свет' },
  { value: 'low_light', label: 'Мало света' },
];

export function windowDirectionLabel(value: WindowDirection | null): string | null {
  return WINDOW_DIRECTION_OPTIONS.find((option) => option.value === value)?.label ?? null;
}

const WINDOW_DIRECTION_PHRASE: Record<WindowDirection, string> = {
  N: 'Северное окно',
  S: 'Южное окно',
  E: 'Восточное окно',
  W: 'Западное окно',
};

/** "Южное окно" и т.п. — для строк вида "5 растений · Южное окно". */
export function windowDirectionPhrase(value: WindowDirection | null): string | null {
  return value ? WINDOW_DIRECTION_PHRASE[value] : null;
}

export function lightLevelLabel(value: LightLevel | null): string | null {
  return LIGHT_LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? null;
}
