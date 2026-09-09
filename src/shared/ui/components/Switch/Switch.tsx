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
      className={`relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
        checked ? 'bg-brand' : 'bg-bg-tertiary'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-card transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
