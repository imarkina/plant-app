import type { ArchiveStatus } from './plant.types';

export const ARCHIVE_STATUS_OPTIONS: { value: ArchiveStatus; label: string }[] = [
  { value: 'died', label: 'Погиб' },
  { value: 'given_away_or_sold', label: 'Подарен / продан' },
  { value: 'other', label: 'Другое' },
];
