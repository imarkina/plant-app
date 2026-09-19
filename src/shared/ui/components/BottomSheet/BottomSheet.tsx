import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
};

const DESKTOP_QUERY = '(min-width: 1024px)';
const DISMISS_THRESHOLD_PX = 100;
const TAP_THRESHOLD_PX = 6;

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const handleChange = () => setIsDesktop(mql.matches);

    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}

/**
 * На мобильных — лист снизу со свайпом вниз для закрытия; на десктопе (>=1024px) —
 * центрированная модалка без свайпа. Подложка блокирует скролл фона, фокус
 * ловится внутри диалога и возвращается на триггер при закрытии.
 */
export const BottomSheet = ({ open, onClose, children, labelledBy }: Props) => {
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragStartYRef = useRef(0);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => setMounted(true));
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }

    queueMicrotask(() => {
      setVisible(false);
      setDragOffset(0);
    });
    const timeout = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [open]);

  // Блокировка скролла фона + перенос фокуса внутрь диалога и обратно при закрытии.
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => panelRef.current?.focus());

    return () => {
      document.body.style.overflow = originalOverflow;
      cancelAnimationFrame(raf);
      previouslyFocusedRef.current?.focus?.();
    };
  }, [open]);

  // Esc для закрытия + focus trap (Tab/Shift+Tab не выходит за пределы диалога).
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) {
      return;
    }

    setDragOffset(Math.max(0, event.clientY - dragStartYRef.current));
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) {
      return;
    }

    draggingRef.current = false;

    if (dragOffset > DISMISS_THRESHOLD_PX || dragOffset < TAP_THRESHOLD_PX) {
      onClose();
    }

    setDragOffset(0);
  };

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

      {/* pointer-events-none — иначе этот на весь экран растянутый враппер перехватывал клики по оверлею в пустой области вокруг панели, и закрытие тапом мимо листа не работало. Возвращаем события самой панели ниже. */}
      <div
        className={`pointer-events-none absolute inset-0 flex ${
          isDesktop ? 'items-center justify-center p-4' : 'items-end justify-center'
        }`}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          tabIndex={-1}
          style={
            dragOffset > 0 ? { transform: `translateY(${dragOffset}px)`, transition: 'none' } : undefined
          }
          className={
            isDesktop
              ? `pointer-events-auto flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl bg-bg-primary shadow-elevated outline-none transition-all duration-normal ease-decelerate ${
                  visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`
              : `pointer-events-auto flex max-h-[88vh] w-full max-w-[440px] flex-col overflow-hidden rounded-t-3xl bg-bg-primary shadow-elevated outline-none transition-transform duration-normal ease-decelerate ${
                  visible ? 'translate-y-0' : 'translate-y-full'
                }`
          }
        >
          {!isDesktop && (
            <div
              aria-hidden="true"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="flex shrink-0 cursor-grab touch-none items-center justify-center py-3 active:cursor-grabbing"
            >
              <span className="h-1.5 w-10 rounded-full bg-brand" />
            </div>
          )}

          <div className={`overflow-y-auto px-4 pb-6 ${isDesktop ? 'pt-6' : 'pt-4'}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};
