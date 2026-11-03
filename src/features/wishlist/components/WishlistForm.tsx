import { useState, type FormEvent } from 'react';
import { Button } from '../../../shared/ui/components/Button/Button';
import { useWishlist } from '../hooks/useWishlist';

const FIELD_INPUT_CLASSES =
  'w-full rounded-2xl border border-surface-glass-border bg-surface-glass px-4 py-3.5 text-body font-sans text-text-primary outline-none backdrop-blur-xl backdrop-saturate-150 transition-shadow duration-100 focus:shadow-[var(--shadow-focus)]';

const SAVE_FAILED_MESSAGE = 'Не удалось добавить растение в вишлист';

export const WishlistForm = () => {
  const { createItem } = useWishlist();

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setError('Введите название растения');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createItem({ name: name.trim(), imageUrl: imageUrl.trim() || null });
      setName('');
      setImageUrl('');
    } catch {
      setError(SAVE_FAILED_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={(event) => void handleSubmit(event)}>
      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-semibold text-text-secondary">Название растения</span>
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Монстера альбо"
          disabled={submitting}
          className={FIELD_INPUT_CLASSES}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-body-sm font-semibold text-text-secondary">
          Ссылка на фото (необязательно)
        </span>
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://..."
          disabled={submitting}
          className={FIELD_INPUT_CLASSES}
        />
      </label>

      {error && <p className="text-caption text-danger">{error}</p>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? 'Добавляем...' : 'Добавить в вишлист'}
      </Button>
    </form>
  );
};
