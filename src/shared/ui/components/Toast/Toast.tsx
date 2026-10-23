import { Check, X } from 'lucide-react';
import type { ToastType } from '../../toast/toastBus';

type Props = {
  message: string | null;
  type?: ToastType;
};

/** Раздел 6.7: glass/1 + shadow/pop, круглая иконка-статус 44px (success = mint α18% + галка). */
export const Toast = ({ message, type = 'success' }: Props) => {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-24 z-[var(--z-toast)] flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass py-2.5 pr-4 pl-2.5 text-body-sm font-semibold text-text-primary shadow-xl backdrop-blur-xl backdrop-saturate-150">
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
            type === 'success' ? 'bg-brand-lime/18 text-brand-lime' : 'bg-danger-soft text-danger'
          }`}
        >
          {type === 'success' ? <Check size={20} strokeWidth={3} /> : <X size={20} strokeWidth={3} />}
        </span>
        {message}
      </div>
    </div>
  );
};
