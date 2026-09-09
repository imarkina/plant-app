const BLOBS = [
  { gradient: 'bg-blob-1', className: 'top-[-10%] left-[-10%] size-[380px] tablet:size-[480px]' },
  { gradient: 'bg-blob-2', className: 'top-[-5%] right-[-15%] size-[320px] tablet:size-[420px]' },
  { gradient: 'bg-blob-3', className: 'bottom-[-10%] left-[10%] size-[360px] tablet:size-[460px]' },
  { gradient: 'bg-blob-4', className: 'right-[-10%] bottom-[-15%] size-[300px] tablet:size-[400px]' },
];

/** Декоративный фон из размытых цветных пятен — только в светлой теме (см. spec "Blob background"). */
export const BlobBackground = () => {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-100 transition-opacity duration-slow [[data-theme='dark']_&]:opacity-0"
    >
      {BLOBS.map((blob, index) => (
        <div
          key={index}
          className={`absolute rounded-full opacity-45 blur-[80px] animate-blob-float ${blob.gradient} ${blob.className}`}
          style={{ animationDelay: `${index * -5}s` }}
        />
      ))}
    </div>
  );
};
