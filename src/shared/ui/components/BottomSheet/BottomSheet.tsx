import { type ReactNode, useEffect, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** Плавающий лист снизу: подложка + drag-ручка + закрытие по клику вне/Esc/ручке. */
export const BottomSheet = ({ open, onClose, children }: Props) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => setMounted(true));
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    queueMicrotask(() => setVisible(false));
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[var(--z-modal)]">
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-overlay backdrop-blur-sm transition-opacity duration-normal ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute bottom-0 left-1/2 flex max-h-[88vh] w-full max-w-[440px] -translate-x-1/2 flex-col overflow-hidden rounded-t-3xl bg-bg-primary shadow-elevated transition-transform duration-normal ease-decelerate ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="flex shrink-0 cursor-pointer items-center justify-center py-3"
        >
          <span className="h-1.5 w-10 rounded-full bg-brand" />
        </button>

        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </div>
    </div>
  );
};
