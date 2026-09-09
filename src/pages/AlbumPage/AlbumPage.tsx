import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BackButton } from '../../shared/ui/components/BackButton/BackButton';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { AddPhotoSheet } from '../../features/plants/components/AddPhotoSheet';
import { PlantComparison } from '../../features/plants/components/PlantsComparison';
import { healthBucketToDotClassName, healthStatusToBucket } from '../../features/plants/models/report-status.mappers';
import type { Plant, PhotoEntry, PhotoType } from '../../features/plants/models/plant.types';
import { pluralizeRu } from '../../shared/helpers';

type SubTab = 'timeline' | 'compare' | 'gallery';

const SUB_TABS: { id: SubTab; label: string; emoji: string }[] = [
  { id: 'timeline', label: 'Таймлайн', emoji: '📅' },
  { id: 'compare', label: 'Сравнение', emoji: '⚖️' },
  { id: 'gallery', label: 'Галерея', emoji: '🖼' },
];

const TYPE_ICON: Record<PhotoType, string> = {
  growth: '📷',
  purchase: '🌱',
  diagnosis: '🩺',
  archive: '📁',
};

const TYPE_LABEL: Record<PhotoType, string> = {
  growth: 'Рост',
  purchase: 'Покупка',
  diagnosis: 'Диагноз',
  archive: 'Архив',
};

const DAY_MS = 24 * 60 * 60 * 1000;

function daysSince(ts: number): number {
  return Math.round((Date.now() - ts) / DAY_MS);
}

function formatGrowthDelta(days: number): string {
  if (days <= 0) {
    return 'Первый день';
  }
  if (days < 30) {
    return `+${days} ${pluralizeRu(days, 'день', 'дня', 'дней')}`;
  }
  const months = Math.round(days / 30);
  return `+${months} ${pluralizeRu(months, 'месяц', 'месяца', 'месяцев')}`;
}

function photoTags(photo: PhotoEntry): string[] {
  const tags: string[] = [photo.type];
  const status = photo.analysis?.health.status;
  if (status) {
    tags.push(healthStatusToBucket(status));
  }
  return tags;
}

export const AlbumPage = () => {
  const { plants } = usePlantsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [subTab, setSubTab] = useState<SubTab>('timeline');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [compareBeforeId, setCompareBeforeId] = useState<string | null>(null);
  const [compareAfterId, setCompareAfterId] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<'before' | 'after'>('before');
  const [compareMode, setCompareMode] = useState<'side' | 'slider'>('side');
  const [sliderPercent, setSliderPercent] = useState(50);

  const activePlants = useMemo(() => plants.filter((plant) => !plant.isArchived), [plants]);

  const requestedPlantId = searchParams.get('plant');
  const selectedPlant: Plant | undefined =
    activePlants.find((plant) => plant.id === requestedPlantId) ?? activePlants[0];

  const selectPlant = (plantId: string) => {
    setSearchParams({ plant: plantId }, { replace: true });
    setCompareBeforeId(null);
    setCompareAfterId(null);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  if (activePlants.length === 0 || !selectedPlant) {
    return (
      <div>
        <BackButton />
        <ComingSoon
          emoji="📸"
          title="Пока нечего показать"
          description="Добавь растение в коллекцию — здесь появится фотоальбом с таймлайном и сравнением."
        />
      </div>
    );
  }

  const sortedPhotos = [...selectedPlant.photos].sort((a, b) => a.createdAt - b.createdAt);
  const firstPhoto = sortedPhotos[0];
  const growthDays = firstPhoto ? daysSince(firstPhoto.createdAt) : 0;
  const speciesName = selectedPlant.photos[0]?.analysis?.identification.botanicalName ?? selectedPlant.name;

  const beforePhoto = sortedPhotos.find((p) => p.id === compareBeforeId) ?? firstPhoto;
  const afterPhoto = sortedPhotos.find((p) => p.id === compareAfterId) ?? sortedPhotos[sortedPhotos.length - 1];

  const handleCompareFromTimeline = (photo: PhotoEntry) => {
    setCompareBeforeId(firstPhoto?.id ?? null);
    setCompareAfterId(photo.id);
    setSubTab('compare');
  };

  const pickForSlot = (photo: PhotoEntry) => {
    if (activeSlot === 'before') {
      setCompareBeforeId(photo.id);
      setActiveSlot('after');
    } else {
      setCompareAfterId(photo.id);
      setActiveSlot('before');
    }
  };

  return (
    <div className="pb-20">
      <BackButton />
      <h1 className="text-h1 text-text-primary">📸 Фотоальбом</h1>
      <p className="mt-1 text-body-sm text-text-muted">
        {speciesName} · {selectedPlant.photos.length} {pluralizeRu(selectedPlant.photos.length, 'фото', 'фото', 'фото')}
        {growthDays > 0 && ` · ${formatGrowthDelta(growthDays)} роста`}
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {activePlants.map((plant) => {
          const isActive = plant.id === selectedPlant.id;
          const avatar = plant.photos[0];
          const name = avatar?.analysis?.identification.commonName ?? plant.name;

          return (
            <button
              key={plant.id}
              type="button"
              onClick={() => selectPlant(plant.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-body-sm font-semibold transition-colors duration-100 ${
                isActive
                  ? 'bg-bg-elevated text-brand-pink shadow-card'
                  : 'border border-surface-glass-border bg-surface-glass text-text-secondary'
              }`}
            >
              <span className="size-7 overflow-hidden rounded-full bg-bg-tertiary">
                {avatar?.imageUrl && (
                  <img src={avatar.imageUrl} alt="" className="size-full object-cover" />
                )}
              </span>
              {name}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex gap-1 rounded-full bg-bg-tertiary p-1">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSubTab(tab.id)}
            className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-sans font-semibold transition-colors duration-100 ${
              subTab === tab.id
                ? 'bg-bg-elevated text-text-primary shadow-card'
                : 'bg-transparent text-text-muted'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'timeline' &&
        (sortedPhotos.length === 0 ? (
          <p className="mt-6 text-body-sm text-text-muted">У этого растения пока нет фото.</p>
        ) : (
          <div className="relative mt-6 pl-9">
            <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-surface-glass-border" />
            <div className="flex flex-col gap-4">
              {sortedPhotos.map((photo, index) => {
                const isLast = index === sortedPhotos.length - 1;
                const days = Math.round((photo.createdAt - firstPhoto.createdAt) / DAY_MS);
                const dateLabel = new Date(photo.createdAt)
                  .toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                  .toUpperCase();
                const suffix = isLast ? 'СЕЙЧАС' : photo.type !== 'growth' ? TYPE_LABEL[photo.type].toUpperCase() : null;
                const bucket = photo.analysis?.health.status
                  ? healthStatusToBucket(photo.analysis.health.status)
                  : null;

                return (
                  <div key={photo.id} className="relative">
                    <span className="absolute top-4 -left-9 flex size-7 items-center justify-center rounded-full border-2 border-bg-primary bg-bg-elevated text-caption shadow-card">
                      {TYPE_ICON[photo.type]}
                    </span>

                    <div className="flex gap-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-3 shadow-card backdrop-blur-xl">
                      <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-bg-tertiary">
                        {photo.imageUrl && (
                          <img src={photo.imageUrl} alt="" className="size-full object-cover" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-caption font-bold text-brand-pink">
                          {dateLabel}
                          {suffix && ` · ${suffix}`}
                        </p>
                        <p className="mt-0.5 text-body-sm text-text-muted">
                          {formatGrowthDelta(days)}
                          {isLast && bucket === 'healthy' && ' · 🌿 Отличный рост!'}
                        </p>

                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {photoTags(photo).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-bg-tertiary px-2 py-0.5 text-caption text-text-secondary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {sortedPhotos.length >= 2 && (
                          <button
                            type="button"
                            onClick={() => handleCompareFromTimeline(photo)}
                            className="mt-2 rounded-full bg-brand/10 px-3 py-1.5 text-caption font-semibold text-brand-pink"
                          >
                            ⚖️ Сравнить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      {subTab === 'compare' &&
        (sortedPhotos.length < 2 ? (
          <p className="mt-6 text-body-sm text-text-muted">
            Нужно минимум 2 фото, чтобы сравнить «до» и «после».
          </p>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-4">
              {(['before', 'after'] as const).map((slot) => {
                const photo = slot === 'before' ? beforePhoto : afterPhoto;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setActiveSlot(slot)}
                    className={`size-20 overflow-hidden rounded-2xl border-2 ${
                      activeSlot === slot ? 'border-brand-pink' : 'border-transparent'
                    }`}
                  >
                    {photo?.imageUrl && (
                      <img src={photo.imageUrl} alt="" className="size-full object-cover" />
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-center text-caption text-text-muted">
              Выбери «{activeSlot === 'before' ? 'До' : 'После'}» из ленты ниже
            </p>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {sortedPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => pickForSlot(photo)}
                  className={`size-14 shrink-0 overflow-hidden rounded-xl border-2 ${
                    photo.id === beforePhoto?.id || photo.id === afterPhoto?.id
                      ? 'border-brand-pink'
                      : 'border-transparent'
                  }`}
                >
                  {photo.imageUrl && <img src={photo.imageUrl} alt="" className="size-full object-cover" />}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-1 rounded-full bg-bg-tertiary p-1">
              <button
                type="button"
                onClick={() => setCompareMode('side')}
                className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-semibold ${
                  compareMode === 'side' ? 'bg-bg-elevated text-text-primary shadow-card' : 'text-text-muted'
                }`}
              >
                ↔️ Бок о бок
              </button>
              <button
                type="button"
                onClick={() => setCompareMode('slider')}
                className={`flex-1 cursor-pointer rounded-full px-3 py-2 text-body-sm font-semibold ${
                  compareMode === 'slider' ? 'bg-bg-elevated text-text-primary shadow-card' : 'text-text-muted'
                }`}
              >
                🔀 Слайдер
              </button>
            </div>

            {beforePhoto && afterPhoto && (
              <>
                {compareMode === 'side' ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      { label: 'До', photo: beforePhoto },
                      { label: 'После', photo: afterPhoto },
                    ].map(({ label, photo }) => (
                      <div key={label} className="overflow-hidden rounded-2xl bg-bg-tertiary shadow-card">
                        <div className="relative aspect-[3/4]">
                          {photo.imageUrl && (
                            <img src={photo.imageUrl} alt={label} className="absolute inset-0 size-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-card-overlay" />
                          <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                            <p className="text-body-sm font-bold">{label}</p>
                            <p className="text-caption opacity-80">
                              {new Date(photo.createdAt).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-bg-tertiary shadow-card">
                      {beforePhoto.imageUrl && (
                        <img src={beforePhoto.imageUrl} alt="До" className="absolute inset-0 size-full object-cover" />
                      )}
                      {afterPhoto.imageUrl && (
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: `inset(0 ${100 - sliderPercent}% 0 0)` }}
                        >
                          <img src={afterPhoto.imageUrl} alt="После" className="absolute inset-0 size-full object-cover" />
                        </div>
                      )}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-card"
                        style={{ left: `${sliderPercent}%` }}
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-bg-elevated/90 px-2 py-0.5 text-caption font-semibold text-text-primary">
                        До
                      </span>
                      <span className="absolute top-2 right-2 rounded-full bg-bg-elevated/90 px-2 py-0.5 text-caption font-semibold text-text-primary">
                        После
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sliderPercent}
                      onChange={(event) => setSliderPercent(Number(event.target.value))}
                      className="mt-3 w-full accent-brand-pink"
                    />
                  </div>
                )}

                <div className="mt-5">
                  <PlantComparison key={`${beforePhoto.id}-${afterPhoto.id}`} first={beforePhoto} last={afterPhoto} />
                </div>
              </>
            )}
          </div>
        ))}

      {subTab === 'gallery' &&
        (sortedPhotos.length === 0 ? (
          <p className="mt-6 text-body-sm text-text-muted">У этого растения пока нет фото.</p>
        ) : (
          <div className="mt-6 grid grid-cols-3 gap-2.5 tablet:grid-cols-4">
            {[...sortedPhotos].reverse().map((photo) => (
              <div key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl bg-bg-tertiary shadow-card">
                {photo.imageUrl && <img src={photo.imageUrl} alt="" className="absolute inset-0 size-full object-cover" />}
                <span className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-bg-elevated/90 text-caption shadow-card">
                  {TYPE_ICON[photo.type]}
                </span>
                {photo.analysis?.health.status && (
                  <span
                    className={`absolute top-1.5 left-1.5 size-2.5 rounded-full border-2 border-white ${healthBucketToDotClassName(
                      healthStatusToBucket(photo.analysis.health.status),
                    )}`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        aria-label="Добавить фото"
        className="fixed right-4 bottom-[calc(24px+env(safe-area-inset-bottom))] z-[var(--z-fab)] flex size-14 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-fab transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        <span className="text-2xl leading-none">+</span>
      </button>

      <AddPhotoSheet
        plant={selectedPlant}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onAdded={() => showToast('📸 Фото добавлено в альбом')}
      />

      {toast && (
        <div className="fixed inset-x-0 bottom-24 z-[var(--z-toast)] flex justify-center px-4">
          <div className="rounded-full bg-bg-elevated px-4 py-2.5 text-body-sm font-semibold text-text-primary shadow-elevated">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
};
