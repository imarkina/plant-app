import './ChipSelect.css';

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
    <div className="chip-select">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? 'chip chip--active' : 'chip'}
          onClick={() => onChange(value === option.value ? null : option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
