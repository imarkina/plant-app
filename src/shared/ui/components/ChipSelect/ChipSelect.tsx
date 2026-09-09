export type ChipOption<T extends string> = {
  value: T;
  label: string;
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
            className={`cursor-pointer rounded-full px-3.5 py-2 text-body-sm font-sans font-medium transition-all duration-100 active:scale-[0.97] ${
              isActive
                ? 'bg-bg-elevated text-brand-pink shadow-card'
                : 'border border-surface-glass-border bg-surface-glass text-text-secondary hover:text-text-primary'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
