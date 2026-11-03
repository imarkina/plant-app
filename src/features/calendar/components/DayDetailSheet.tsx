import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomSheet } from '../../../shared/ui/components/BottomSheet/BottomSheet';
import { PhotoLightbox } from '../../plants/components/PhotoLightbox';
import type { PhotoEntry } from '../../plants/models/plant.types';
import type { CalendarEvent } from '../models/calendar.types';
import {
  EVENT_KIND_ICON,
  EVENT_KIND_ICON_CLASS,
  EVENT_KIND_LABEL,
  EVENT_STATUS_LABEL,
} from '../models/calendar-event-labels';

const STATUS_SORT_ORDER = { done: 0, missed: 1, planned: 2 } as const;

function formatFullDate(day: number): string {
  const raw = new Date(day).toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

const PHOTO_KINDS = new Set(['photo', 'purchase', 'diagnosis']);

type Props = {
  day: number | null;
  events: CalendarEvent[];
  onClose: () => void;
};

export const DayDetailSheet = ({ day, events, onClose }: Props) => {
  const navigate = useNavigate();
  const [zoomedEvent, setZoomedEvent] = useState<CalendarEvent | null>(null);

  const sortedEvents = [...events].sort((a, b) => STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]);

  const handleEventClick = (event: CalendarEvent) => {
    if (PHOTO_KINDS.has(event.kind) && event.photoUrl) {
      setZoomedEvent(event);
      return;
    }
    onClose();
    void navigate(`/plant/${event.plantId}`);
  };

  const zoomedPhoto: PhotoEntry | null = zoomedEvent
    ? { id: zoomedEvent.photoId ?? zoomedEvent.id, imageUrl: zoomedEvent.photoUrl, createdAt: zoomedEvent.date, type: 'growth' }
    : null;

  return (
    <>
      <BottomSheet open={day !== null} onClose={onClose} labelledBy="day-detail-title">
        {day !== null && (
          <div>
            <h2 id="day-detail-title" className="text-h3 text-text-primary">
              {formatFullDate(day)}
            </h2>

            {sortedEvents.length === 0 ? (
              <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
                <p className="text-body-sm text-text-muted">Ничего не запланировано</p>
              </div>
            ) : (
              <div className="mt-4 flex max-h-[55vh] flex-col gap-2 overflow-y-auto">
                {sortedEvents.map((event) => {
                  const Icon = EVENT_KIND_ICON[event.kind];

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleEventClick(event)}
                      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 text-left shadow-card backdrop-blur-xl backdrop-saturate-150"
                    >
                      <span className="relative size-8 shrink-0 overflow-hidden rounded-full bg-bg-tertiary">
                        {event.plantAvatarUrl && (
                          <img src={event.plantAvatarUrl} alt="" className="size-full object-cover" />
                        )}
                      </span>
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary ${EVENT_KIND_ICON_CLASS[event.kind]}`}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-semibold text-text-primary">{event.plantName}</p>
                        <p className="truncate text-caption text-text-muted">{EVENT_KIND_LABEL[event.kind]}</p>
                      </span>
                      <span className="shrink-0 text-caption font-semibold text-text-secondary">
                        {EVENT_STATUS_LABEL[event.status]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </BottomSheet>

      {zoomedPhoto && <PhotoLightbox photo={zoomedPhoto} onClose={() => setZoomedEvent(null)} />}
    </>
  );
};
