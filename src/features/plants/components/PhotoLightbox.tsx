import { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import type { PhotoEntry } from '../models/plant.types';

type Props = {
  photo: PhotoEntry;
  onClose: () => void;
  onDelete?: () => void;
};

/**
 * Простой полноэкранный просмотр — без pinch-to-zoom/swipe-навигации
 * (см. заметку в PR: это осознанное упрощение относительно тех. задания).
 */
export const PhotoLightbox = ({ photo, onClose, onDelete }: Props) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleDelete = () => {
    if (window.confirm('Удалить это фото? Действие необратимо.')) {
      onDelete?.();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-black/90 p-4"
    >
      {photo.imageUrl && (
        <img
          src={photo.imageUrl}
          alt=""
          onClick={(event) => event.stopPropagation()}
          className="max-h-full max-w-full rounded-2xl object-contain shadow-elevated"
        />
      )}

      <button
        type="button"
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl backdrop-saturate-150"
      >
        <X size={20} />
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleDelete();
          }}
          className="absolute bottom-6 flex items-center gap-2 rounded-full bg-danger px-4 py-2.5 text-body-sm font-semibold text-white shadow-elevated"
        >
          <Trash2 size={16} />
          Удалить фото
        </button>
      )}
    </div>
  );
};
