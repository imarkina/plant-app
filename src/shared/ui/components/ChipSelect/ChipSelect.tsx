import type { ReactNode } from 'react';

export type ChipOption<T extends string> = {
  value: T;
  label: string;
  /** Tailwind bg-* class for the 8px status dot (spec §6.4). Omit for chips with no natural accent color. */
  dotClassName?: string;
};

type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

/** Single pill button matching spec §6.4 — exported so callers can splice in a chip (e.g. "Все") alongside a ChipSelect's options in one flex-wrap row. */
export function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-sans font-medium transition-all duration-100 active:scale-[0.97] ${
        active
          ? 'bg-bg-elevated text-accent shadow-card'
          : 'border border-surface-glass-border bg-surface-glass text-text-secondary hover:text-text-primary'
      }`}
    >
      {children}
    </button>
  );
}

type Props<T extends string> = {
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
};

export function ChipSelect<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <Chip key={option.value} active={isActive} onClick={() => onChange(isActive ? null : option.value)}>
            {option.dotClassName && (
              <span className={`size-2 shrink-0 rounded-full ${option.dotClassName}`} />
            )}
            {option.label}
          </Chip>
        );
      })}
    </div>
  );
}
