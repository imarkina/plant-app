import type { ChangeEvent } from 'react';
import { Loader2, Plus } from 'lucide-react';

type Props = {
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
  className?: string;
};

/** Обычная заанкоренная кнопка добавления растения — замена плавающему FAB, который висел поверх контента без подписи. */
export const AddPlantButton = ({ onFileSelect, loading, className = '' }: Props) => {
  return (
    <label
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3.5 text-button font-sans font-semibold text-white shadow-fab transition-transform duration-100 active:scale-[0.98] ${className}`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        disabled={loading}
        className="hidden"
      />
      {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} strokeWidth={2.5} />}
      Добавить растение
    </label>
  );
};
