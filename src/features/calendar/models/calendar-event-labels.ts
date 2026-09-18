import { Droplet, FlaskConical, CloudRain, Camera, Sprout, Stethoscope } from 'lucide-react';
import type { CalendarEventKind } from './calendar.types';

export const EVENT_KIND_DOT_CLASS: Record<CalendarEventKind, string> = {
  watering: 'bg-info',
  feeding: 'bg-warn',
  misting: 'bg-brand-peach',
  'photo-task': 'bg-brand-purple',
  purchase: 'bg-accent',
  diagnosis: 'bg-danger',
  photo: 'bg-brand-purple',
};

export const EVENT_KIND_ICON: Record<CalendarEventKind, typeof Droplet> = {
  watering: Droplet,
  feeding: FlaskConical,
  misting: CloudRain,
  'photo-task': Camera,
  purchase: Sprout,
  diagnosis: Stethoscope,
  photo: Camera,
};

export const EVENT_KIND_ICON_CLASS: Record<CalendarEventKind, string> = {
  watering: 'text-info',
  feeding: 'text-warn',
  misting: 'text-brand-peach',
  'photo-task': 'text-brand-purple',
  purchase: 'text-accent',
  diagnosis: 'text-danger',
  photo: 'text-brand-purple',
};

export const EVENT_KIND_LABEL: Record<CalendarEventKind, string> = {
  watering: 'Полив',
  feeding: 'Подкормка',
  misting: 'Опрыскивание',
  'photo-task': 'Напоминание сфотографировать',
  purchase: 'Покупка',
  diagnosis: 'Диагноз',
  photo: 'Фото',
};

export const EVENT_STATUS_LABEL = {
  done: 'Выполнено ✅',
  planned: 'Запланировано ⏳',
  missed: 'Пропущено ❌',
} as const;
