type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export const Switch = ({ checked, onChange, label }: Props) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[30px] w-[52px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? 'bg-brand' : 'border border-surface-glass-border bg-surface-glass'
      }`}
    >
      <span
        className={`absolute top-1 left-1 size-[22px] rounded-full bg-white shadow-[0_2px_6px_rgba(38,35,59,0.2)] transition-transform duration-200 ${
          checked ? 'translate-x-[22px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
