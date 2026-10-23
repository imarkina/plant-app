import { Armchair, Bed, CookingPot, ShowerHead, Sofa, type LucideIcon } from 'lucide-react';

const KEYWORD_ICONS: [pattern: RegExp, icon: LucideIcon][] = [
  [/гостин/i, Sofa],
  [/спальн/i, Bed],
  [/кухн/i, CookingPot],
  [/ванн|сануз/i, ShowerHead],
];

/** Эвристика: подбираем иконку комнаты по ключевым словам в названии, иначе — дефолтная. */
export function roomIcon(name: string): LucideIcon {
  const match = KEYWORD_ICONS.find(([pattern]) => pattern.test(name));

  return match ? match[1] : Armchair;
}
