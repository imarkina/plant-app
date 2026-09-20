import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  year: number;
  month: number;
  isCurrentMonth: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
};

function formatMonthTitle(year: number, month: number): string {
  const raw = new Date(year, month, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export const CalendarHeader = ({ year, month, isCurrentMonth, onPrevMonth, onNextMonth, onToday }: Props) => {
  return (
    <div className="mt-2 flex items-center justify-between">
      <h1 className="text-h1 desktop:text-h1-lg text-text-primary">{formatMonthTitle(year, month)}</h1>
      <div className="flex items-center gap-2">
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={onToday}
            className="cursor-pointer rounded-full bg-brand px-3.5 py-2 text-caption font-semibold text-white shadow-fab active:scale-[0.97]"
          >
            Сегодня
          </button>
        )}
        <div className="flex items-center gap-1 rounded-full border border-surface-glass-border bg-surface-glass p-1 backdrop-blur-xl backdrop-saturate-150">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label="Предыдущий месяц"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Следующий месяц"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
