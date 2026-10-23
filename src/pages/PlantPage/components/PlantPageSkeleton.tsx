import { Skeleton } from '../../../shared/ui/components/Skeleton/Skeleton';

/** Повторяет силуэт PlantHero (фото 220-260px) + таб-бар + карточки контента. */
export const PlantPageSkeleton = () => (
  <div>
    <Skeleton className="h-[220px] w-full rounded-3xl tablet:h-[260px]" />
    <div className="mt-4 flex gap-2">
      <Skeleton className="h-9 w-20 rounded-full" />
      <Skeleton className="h-9 w-16 rounded-full" />
      <Skeleton className="h-9 w-20 rounded-full" />
      <Skeleton className="h-9 w-24 rounded-full" />
    </div>
    <Skeleton className="mt-6 h-28 w-full rounded-2xl" />
    <div className="mt-3 grid grid-cols-2 gap-3">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  </div>
);
