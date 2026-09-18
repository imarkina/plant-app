import { useMemo, useState } from 'react';
import { Header } from '../../shared/ui/components/Header/Header';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';
import { CalendarHeader } from '../../features/calendar/components/CalendarHeader';
import { CalendarGrid } from '../../features/calendar/components/CalendarGrid';
import { DayDetailSheet } from '../../features/calendar/components/DayDetailSheet';
import { useCalendarEvents } from '../../features/calendar/hooks/useCalendarEvents';

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
        <p className="mt-6 text-body-sm text-text-muted">Загрузка...</p>
      </>
    );
  }

  if (plants.length === 0) {
    return (
      <>
        <Header />
        <ComingSoon
          emoji="🗓"
          title="Пока пусто"
          description="Добавь первое растение — здесь появится календарь ухода за ним."
        />
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
