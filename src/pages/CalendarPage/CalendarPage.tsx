import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../shared/ui/components/Header/Header';
import { CalendarHeader } from '../../features/calendar/components/CalendarHeader';
import { CalendarGrid } from '../../features/calendar/components/CalendarGrid';
import { DayDetailSheet } from '../../features/calendar/components/DayDetailSheet';
import { useCalendarEvents } from '../../features/calendar/hooks/useCalendarEvents';
import { Skeleton } from '../../shared/ui/components/Skeleton/Skeleton';

const now = new Date();

export const CalendarPage = () => {
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const { weeks, eventsByDay, plants, loading } = useCalendarEvents(year, month);

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  const hasEventsInMonth = useMemo(() => {
    for (const day of eventsByDay.keys()) {
      if (new Date(day).getMonth() === month) {
        return true;
      }
    }
    return false;
  }, [eventsByDay, month]);

  const goToMonth = (offset: number, dir: 'left' | 'right') => {
    const next = new Date(year, month + offset, 1);
    setDirection(dir);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  const handleToday = () => {
    setDirection(now.getMonth() >= month ? 'right' : 'left');
    setYear(now.getFullYear());
    setMonth(now.getMonth());
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }, (_, i) => (
            <Skeleton key={i} className="aspect-square" />
          ))}
        </div>
      </>
    );
  }

  if (plants.length === 0) {
    return (
      <>
        <Header />
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-3xl border border-surface-glass-border bg-surface-glass text-3xl shadow-card backdrop-blur-xl backdrop-saturate-150">
            🗓
          </div>
          <h2 className="mt-4 text-h2 text-text-primary">Пока пусто</h2>
          <p className="mt-2 max-w-xs text-body-sm text-text-muted">
            Добавь первое растение — здесь появится календарь ухода за ним.
          </p>
          <Link
            to="/collection"
            className="mt-5 rounded-2xl bg-brand px-4 py-3.5 text-button font-sans font-semibold text-white shadow-fab transition-transform duration-100 active:scale-[0.98]"
          >
            Перейти в коллекцию
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <CalendarHeader
        year={year}
        month={month}
        isCurrentMonth={isCurrentMonth}
        onPrevMonth={() => goToMonth(-1, 'left')}
        onNextMonth={() => goToMonth(1, 'right')}
        onToday={handleToday}
      />
      <CalendarGrid
        weeks={weeks}
        eventsByDay={eventsByDay}
        year={year}
        month={month}
        direction={direction}
        onSelectDay={setSelectedDay}
        onSwipePrevMonth={() => goToMonth(-1, 'left')}
        onSwipeNextMonth={() => goToMonth(1, 'right')}
      />

      {!hasEventsInMonth && (
        <p className="mt-6 text-center text-body-sm text-text-muted">В этом месяце всё спокойно 🌿</p>
      )}

      <DayDetailSheet
        day={selectedDay}
        events={selectedDay !== null ? (eventsByDay.get(selectedDay) ?? []) : []}
        onClose={() => setSelectedDay(null)}
      />
    </>
  );
};
