/** photo-task — запланированное напоминание сфотографировать (из care_tasks); photo — уже сделанный обычный снимок. */
export type CalendarEventKind =
  | 'watering'
  | 'feeding'
  | 'misting'
  | 'photo-task'
  | 'purchase'
  | 'diagnosis'
  | 'photo';

export type CalendarEventStatus = 'done' | 'planned' | 'missed';

export interface CalendarEvent {
  id: string;
  /** Начало суток (локальное время), к которым относится событие. */
  date: number;
  kind: CalendarEventKind;
  status: CalendarEventStatus;
  plantId: string;
  plantName: string;
  /** Аватарка растения (первое фото) — для строки в детальном виде дня. */
  plantAvatarUrl?: string;
  /** Только для kind, производных от фото (purchase/diagnosis/photo). */
  photoId?: string;
  photoUrl?: string;
}
