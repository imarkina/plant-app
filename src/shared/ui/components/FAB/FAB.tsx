import type { ChangeEvent } from 'react';
import { Loader2, Plus } from 'lucide-react';

type Props = {
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
};

/** Плавающая кнопка добавления растения — поверх BottomNav, в той же мобильной колонке. */
export const FAB = ({ onFileSelect, loading }: Props) => {
  return (
    <div className="pointer-events-none fixed bottom-[calc(112px+env(safe-area-inset-bottom))] left-1/2 z-[var(--z-fab)] flex w-full max-w-[440px] -translate-x-1/2 justify-end px-4">
      <label className="pointer-events-auto flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-fab transition-transform duration-200 hover:rotate-90 hover:scale-105 active:scale-95">
        <input
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          disabled={loading}
          className="hidden"
        />
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Plus size={26} strokeWidth={2.5} />}
      </label>
    </div>
  );
};
