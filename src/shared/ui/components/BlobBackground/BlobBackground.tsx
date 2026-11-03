/** Раздел 13 "Background Effects": максимум 3 блоба, blur 80-100px, opacity 0.08-0.15. */
const BLOBS = [
  { gradient: 'bg-blob-1', className: 'top-[-10%] left-[-10%] size-[420px] tablet:size-[520px]' },
  { gradient: 'bg-blob-2', className: 'top-[-5%] right-[-15%] size-[360px] tablet:size-[460px]' },
  { gradient: 'bg-blob-3', className: 'bottom-[-10%] left-[10%] size-[400px] tablet:size-[500px]' },
];

/** Декоративный "живой" фон из размытых цветных пятен (принцип "Living Surfaces") — обе темы. */
export const BlobBackground = () => {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {BLOBS.map((blob, index) => (
        <div
          key={index}
          className={`absolute rounded-full opacity-10 blur-[90px] animate-blob-float ${blob.gradient} ${blob.className}`}
          style={{ animationDelay: `${index * -5}s` }}
        />
      ))}
    </div>
  );
};
