import type { ChangeEvent } from 'react';
import { Camera } from 'lucide-react';

type Props = {
  title: string;
  subtitle: string;
  loading: boolean;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const UploadZone = ({ onFileSelect, loading, title, subtitle }: Props) => {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border-[3px] border-dashed border-surface-glass-border bg-bg-secondary px-6 py-8 text-center transition-colors duration-100 hover:border-accent hover:bg-accent-glow">
      <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
      <div className="mb-1 flex size-14 items-center justify-center rounded-xl bg-accent-glow text-accent">
        <Camera size={28} strokeWidth={2} />
      </div>
      <p className="text-h4 desktop:text-h4-lg text-text-primary">
        {loading ? 'Анализируем...' : title}
      </p>
      <p className="text-body-sm desktop:text-body-sm-lg text-text-muted">{subtitle}</p>
    </label>
  );
};
