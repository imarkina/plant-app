import type { PhotoType } from './plant.types';

export const PHOTO_TYPE_ICON: Record<PhotoType, string> = {
  growth: '📷',
  purchase: '🌱',
  diagnosis: '🩺',
  archive: '📁',
};

export const PHOTO_TYPE_LABEL: Record<PhotoType, string> = {
  growth: 'Рост',
  purchase: 'Покупка',
  diagnosis: 'Диагноз',
  archive: 'Архив',
};
