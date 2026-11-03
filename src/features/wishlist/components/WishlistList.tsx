import { useWishlist } from '../hooks/useWishlist';

export const WishlistList = () => {
  const { items, setPurchased } = useWishlist();

  if (items.length === 0) {
    return (
      <p className="mt-4 text-body-sm text-text-muted">Вишлист пуст — добавьте растение ниже</p>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-2.5">
      {items.map((item) => (
        <label
          key={item.id}
          className={`flex items-center gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-150 ${
            item.isPurchased ? 'opacity-60' : ''
          }`}
        >
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-bg-tertiary text-xl">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
            ) : (
              '🌿'
            )}
          </div>
          <p className="min-w-0 flex-1 truncate text-h4 text-text-primary">{item.name}</p>
          <input
            type="checkbox"
            checked={item.isPurchased}
            onChange={(event) => void setPurchased(item.id, event.target.checked)}
            aria-label={`Куплено: ${item.name}`}
            className="size-5 shrink-0 accent-brand-purple"
          />
        </label>
      ))}
    </div>
  );
};
