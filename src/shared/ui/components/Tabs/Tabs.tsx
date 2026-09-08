type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export const Tabs = ({ tabs, active, onChange }: Props) => {
  return (
    <div className="my-4 flex gap-1 rounded-full bg-bg-tertiary p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-sans font-semibold transition-colors duration-100 ${
            active === tab.id
              ? 'bg-bg-secondary text-text-primary shadow-card'
              : 'bg-transparent text-text-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
