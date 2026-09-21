export type ChipOption<T extends string> = {
  value: T;
  label: string;
  /** Tailwind bg-* class for the 8px status dot (spec §6.4). Omit for chips with no natural accent color. */
  dotClassName?: string;
};

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
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(isActive ? null : option.value)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-sans font-medium transition-all duration-100 active:scale-[0.97] ${
              isActive
                ? 'bg-bg-elevated text-accent shadow-card'
                : 'border border-surface-glass-border bg-surface-glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {option.dotClassName && (
              <span className={`size-2 shrink-0 rounded-full ${option.dotClassName}`} />
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
