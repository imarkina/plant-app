import { type PointerEvent, useRef } from 'react';
import type { CalendarEvent } from '../models/calendar.types';
import { getCalendarNow, startOfDay } from '../models/calendar.helpers';
import { EVENT_KIND_DOT_CLASS } from '../models/calendar-event-labels';

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const SWIPE_THRESHOLD_PX = 50;
const MAX_INDICATORS = 3;

type Props = {
  weeks: number[][];
  eventsByDay: Map<number, CalendarEvent[]>;
  year: number;
  month: number;
  direction: 'left' | 'right';
  onSelectDay: (day: number) => void;
  onSwipePrevMonth: () => void;
  onSwipeNextMonth: () => void;
};

export const CalendarGrid = ({
  weeks,
  eventsByDay,
  year,
  month,
  direction,
  onSelectDay,
  onSwipePrevMonth,
  onSwipeNextMonth,
}: Props) => {
  const startXRef = useRef<number | null>(null);
  const today = startOfDay(getCalendarNow());

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    startXRef.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (startXRef.current === null) {
      return;
    }

    const deltaX = event.clientX - startXRef.current;
    startXRef.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX) {
      return;
    }

    if (deltaX < 0) {
      onSwipeNextMonth();
    } else {
      onSwipePrevMonth();
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1 text-center text-caption font-semibold text-text-muted uppercase">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div
        key={`${year}-${month}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          startXRef.current = null;
        }}
        className={`mt-2 grid touch-pan-y grid-cols-7 gap-y-1 ${
          direction === 'left' ? 'animate-calendar-slide-left' : 'animate-calendar-slide-right'
        }`}
      >
        {weeks.flat().map((day) => {
          const date = new Date(day);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = day === today;
          const dayEvents = eventsByDay.get(day) ?? [];
          const indicators = dayEvents.slice(0, MAX_INDICATORS);
          const overflow = dayEvents.length - indicators.length;

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl py-2 transition-colors active:bg-bg-tertiary ${
                isCurrentMonth ? '' : 'opacity-40'
              }`}
            >
              <span
                className={`flex size-8 items-center justify-center rounded-full text-body-sm font-semibold ${
                  isToday ? 'bg-brand text-white' : 'text-text-primary'
                }`}
              >
                {date.getDate()}
              </span>
              <span className="flex h-4 items-center gap-0.5">
                {indicators.map((event) =>
                  event.kind === 'purchase' && event.photoUrl ? (
                    <span
                      key={event.id}
                      className="size-4 shrink-0 overflow-hidden rounded-full border border-white/70 shadow-sm"
                    >
                      <img src={event.photoUrl} alt="" className="size-full object-cover" />
                    </span>
                  ) : (
                    <span
                      key={event.id}
                      className={`size-1.5 shrink-0 rounded-full ${EVENT_KIND_DOT_CLASS[event.kind]} ${
                        event.status === 'done' ? '' : 'opacity-50'
                      }`}
                    />
                  ),
                )}
                {overflow > 0 && <span className="text-[10px] leading-none font-semibold text-text-muted">+{overflow}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
