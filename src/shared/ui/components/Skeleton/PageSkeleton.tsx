import { Skeleton } from './Skeleton';

/** Заглушка для мест, где ещё не известно, какая именно страница грузится (Suspense-фоллбэк маршрутов, auth-гейт) — общий силуэт вместо конкретного макета. */
export const PageSkeleton = () => (
  <div className="mt-2 flex flex-col gap-3">
    <Skeleton className="h-4 w-40" />
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="mt-2 h-40 w-full rounded-3xl" />
    <div className="mt-1 grid grid-cols-3 gap-2">
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
      <Skeleton className="h-12" />
    </div>
  </div>
);
