import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Stethoscope } from 'lucide-react';
import { useAuthContext } from '../../features/auth';
import { usePlantsContext } from '../../features/plants/hooks/usePlantsContext';
import { usePlantReport } from '../../features/plants/hooks/usePlantReport';
import {
  healthBucketToDotClassName,
  healthStatusToBucket,
} from '../../features/plants/models/report-status.mappers';
import type { Plant, PhotoEntry } from '../../features/plants/models/plant.types';
import type { PlantReport } from '../../features/plants/models/plant-report.types';
import {
  formatDue,
  getCareStatus,
  getNextDue,
  useCareTasksForPlants,
  type CareTask,
  type CareTaskType,
} from '../../features/care-tasks';
import { useAddPlant } from '../../features/plants/hooks/useAddPlant';
import { resizeImage } from '../../shared/image/resize';
import { deriveDisplayName, pluralizeRu } from '../../shared/helpers';
import { Header } from '../../shared/ui/components/Header/Header';
import { FAB } from '../../shared/ui/components/FAB/FAB';
import { ComingSoon } from '../../shared/ui/components/ComingSoon/ComingSoon';
import { Confetti } from '../../shared/ui/components/Confetti/Confetti';
import { Toast } from '../../shared/ui/components/Toast/Toast';
import { useToast } from '../../shared/ui/hooks/useToast';

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();

  if (hour < 6) {
    return { text: 'Доброй ночи', emoji: '🌙' };
  }
  if (hour < 12) {
    return { text: 'Доброе утро', emoji: '🌅' };
  }
  if (hour < 18) {
    return { text: 'Добрый день', emoji: '☀️' };
  }
  return { text: 'Добрый вечер', emoji: '🌆' };
}

function formatTodayDate(): string {
  const raw = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

/** «Растение дня» — та, кому сейчас нужнее всего внимание: болеет/увядает важнее, чем разница в пару дней полива. */
function pickFeaturedPlant(plants: Plant[], tasksByPlantId: Map<string, CareTask[]>): Plant | null {
  if (plants.length === 0) {
    return null;
  }

  const scored = plants.map((plant) => {
    const status = plant.photos[0]?.analysis?.health.status;
    const bucket = status ? healthStatusToBucket(status) : 'healthy';
    const bucketScore = bucket === 'sick' ? 100 : bucket === 'warning' ? 50 : 0;

    const wateringTask = tasksByPlantId.get(plant.id)?.find((task) => task.type === 'watering');
    const overdueDays = wateringTask
      ? Math.max(0, Math.floor((Date.now() - getNextDue(wateringTask)) / (24 * 60 * 60 * 1000)))
      : 0;

    return { plant, score: bucketScore + overdueDays };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].plant;
}

const TASK_ICON: Record<CareTaskType, string> = {
  watering: '💧',
  misting: '💦',
  feeding: '🌱',
  photo: '📸',
};

const TASK_VERB: Record<CareTaskType, string> = {
  watering: 'Полить',
  misting: 'Опрыскать',
  feeding: 'Подкормить',
  photo: 'Сфотографировать',
};

type TodayItem =
  | { kind: 'task'; key: string; plant: Plant; task: CareTask }
  | { kind: 'alert'; key: string; plant: Plant };

function buildTodayItems(plants: Plant[], tasksByPlantId: Map<string, CareTask[]>): TodayItem[] {
  const items: TodayItem[] = [];

  for (const plant of plants) {
    for (const task of tasksByPlantId.get(plant.id) ?? []) {
      if (getCareStatus(task) !== 'ok') {
        items.push({ kind: 'task', key: task.id, plant, task });
      }
    }

    const status = plant.photos[0]?.analysis?.health.status;
    if (status && healthStatusToBucket(status) !== 'healthy') {
      items.push({ kind: 'alert', key: `alert-${plant.id}`, plant });
    }
  }

  return items;
}

function createPhotoEntry(image: Blob, analysis: PlantReport | undefined): PhotoEntry {
  return { id: crypto.randomUUID(), createdAt: Date.now(), image, analysis, type: 'growth' };
}

export const HomePage = () => {
  const { user } = useAuthContext();
  const { plants, loading, addPhoto } = usePlantsContext();
  const { fetchAnalysis } = usePlantReport();
  const { addPlantFromFile, loading: addingPlant } = useAddPlant();
  const navigate = useNavigate();

  const activePlants = useMemo(() => plants.filter((plant) => !plant.isArchived), [plants]);
  const plantIds = useMemo(() => activePlants.map((plant) => plant.id), [activePlants]);
  const { tasksByPlantId, loading: tasksLoading, markDone, applyPhotoBackoff } = useCareTasksForPlants(plantIds);
  const { message: toast, showToast } = useToast();
  const [celebrate, setCelebrate] = useState(false);
  const [todayExpanded, setTodayExpanded] = useState(false);
  const backoffChecked = useRef(false);

  useEffect(() => {
    if (backoffChecked.current || tasksLoading || tasksByPlantId.size === 0) {
      return;
    }
    backoffChecked.current = true;
    void applyPhotoBackoff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksLoading, tasksByPlantId]);

  const greeting = getGreeting();
  const featuredPlant = pickFeaturedPlant(activePlants, tasksByPlantId);
  const todayItems = buildTodayItems(activePlants, tasksByPlantId);

  const addPhotoToPlant = async (plantId: string, file: File) => {
    const resized = await resizeImage(file);
    const analysis = await fetchAnalysis(resized);
    await addPhoto(plantId, createPhotoEntry(resized, analysis));
  };

  const handleFeaturedWater = () => {
    if (!featuredPlant) {
      return;
    }
    const task = tasksByPlantId.get(featuredPlant.id)?.find((t) => t.type === 'watering');
    if (task) {
      void markDone(task.id);
    }
  };

  const handleFeaturedPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && featuredPlant) {
      await addPhotoToPlant(featuredPlant.id, file);
    }
    event.target.value = '';
  };

  const handleTaskPhoto = async (
    event: ChangeEvent<HTMLInputElement>,
    plantId: string,
    taskId: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      await addPhotoToPlant(plantId, file);
      await markDone(taskId);
      setCelebrate(true);
      showToast('Отлично! Таймлайн обновлён 🌿');
    }
    event.target.value = '';
  };

  const handleAddPlant = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const plantId = await addPlantFromFile(file);
    if (plantId) {
      navigate(`/plant/${plantId}`);
    }
  };

  if (loading) {
    return (
      <>
        <Header title={`${greeting.text}, ${deriveDisplayName(user?.email ?? null)} ${greeting.emoji}`} />
        <p className="text-body-sm text-text-muted">Загрузка...</p>
      </>
    );
  }

  if (!featuredPlant) {
    return (
      <>
        <Header title={`${greeting.text}, ${deriveDisplayName(user?.email ?? null)} ${greeting.emoji}`} />
        <ComingSoon
          emoji="🌱"
          title="Пока пусто"
          description="Добавь первое растение — здесь появится дашборд с задачами на сегодня и растением дня."
        />
        <FAB onFileSelect={handleAddPlant} loading={addingPlant} />
      </>
    );
  }

  const featuredPhoto = featuredPlant.photos[0];
  const featuredAnalysis = featuredPhoto?.analysis;
  const featuredName = featuredAnalysis?.identification.commonName ?? featuredPlant.name;
  const featuredBucket = featuredAnalysis?.health.status
    ? healthStatusToBucket(featuredAnalysis.health.status)
    : null;
  const featuredWateringTask = tasksByPlantId.get(featuredPlant.id)?.find((t) => t.type === 'watering');

  const attentionCount = activePlants.filter((plant) => {
    const status = plant.photos[0]?.analysis?.health.status;
    return status ? healthStatusToBucket(status) !== 'healthy' : false;
  }).length;

  return (
    <>
      <div className="pt-2">
        <p className="text-label text-text-muted uppercase">
          {greeting.text}, {deriveDisplayName(user?.email ?? null)} {greeting.emoji}
        </p>
        <h1 className="mt-2 text-h1 desktop:text-h1-lg text-text-primary">
          Твои <span className="bg-brand bg-clip-text text-transparent">джунгли</span> в порядке?
        </h1>
        <p className="mt-2 text-body-sm text-text-muted">
          {formatTodayDate()} ·{' '}
          {attentionCount > 0
            ? `${attentionCount} ${pluralizeRu(attentionCount, 'растение требует', 'растения требуют', 'растений требуют')} внимания`
            : 'Все растения в порядке ✓'}
        </p>
      </div>

      <Link
        to={`/plant/${featuredPlant.id}`}
        className="mt-5 block overflow-hidden rounded-3xl bg-bg-tertiary shadow-card"
      >
        <div className="relative aspect-[4/3]">
          {featuredPhoto?.imageUrl && (
            <img
              src={featuredPhoto.imageUrl}
              alt={featuredName}
              className="absolute inset-0 size-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-card-overlay" />

          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-bg-elevated/90 px-2.5 py-1 text-caption font-semibold text-text-primary shadow-card backdrop-blur-xl backdrop-saturate-150">
            ⭐ Растение дня
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-h2 text-white">{featuredName}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-caption text-white/80">
              {featuredWateringTask && (
                <span>Последний полив: {formatDue(getNextDue(featuredWateringTask))}</span>
              )}
              {featuredBucket && (
                <span className="inline-flex items-center gap-1">
                  <span className={`size-2 rounded-full ${healthBucketToDotClassName(featuredBucket)}`} />
                  {featuredBucket === 'healthy' ? 'Здорова' : featuredBucket === 'warning' ? 'Внимание' : 'Болеет'}
                </span>
              )}
            </p>
          </div>
        </div>
      </Link>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={handleFeaturedWater}
          disabled={!featuredWateringTask}
          className="cursor-pointer rounded-2xl bg-brand px-3 py-3 text-body-sm font-semibold text-white shadow-card active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40"
        >
          💧 Полить
        </button>
        <label className="cursor-pointer rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-center text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]">
          <input type="file" accept="image/*" onChange={handleFeaturedPhoto} className="hidden" />
          <span className="inline-flex items-center gap-1.5">
            <Camera size={16} className="text-brand-purple" /> Фото
          </span>
        </label>
        <Link
          to={`/plant/${featuredPlant.id}`}
          className="flex items-center justify-center gap-1.5 rounded-2xl border border-surface-glass-border bg-bg-elevated px-3 py-3 text-body-sm font-semibold text-text-primary shadow-card active:scale-[0.97]"
        >
          <Stethoscope size={16} className="text-danger" /> Диагноз
        </Link>
      </div>

      <div className="mt-7 flex items-center justify-between">
        <p className="text-h3 text-text-primary">🔔 Сегодня</p>
        <Link to="/calendar" className="text-body-sm font-semibold text-brand-pink">
          Календарь →
        </Link>
      </div>

      {todayItems.length === 0 ? (
        <p className="mt-3 text-body-sm text-text-muted">Дел на сегодня нет — можно выдохнуть 🌿</p>
      ) : (
        <div className="mt-3 flex flex-col gap-2.5">
          {(todayExpanded ? todayItems : todayItems.slice(0, 3)).map((item) => {
            const name = item.plant.photos[0]?.analysis?.identification.commonName ?? item.plant.name;

            if (item.kind === 'alert') {
              const diagnosis = item.plant.photos[0]?.analysis?.health.diagnosis;

              return (
                <Link
                  key={item.key}
                  to={`/plant/${item.plant.id}`}
                  className="flex items-center gap-3 rounded-2xl border-l-4 border-danger bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-danger-soft text-lg">
                    🚨
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-semibold text-text-primary">{name} нуждается в осмотре</p>
                    <p className="truncate text-caption text-text-muted">{diagnosis ?? 'Нужен диагноз'}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-danger px-3 py-1.5 text-caption font-semibold text-white">
                    Смотреть
                  </span>
                </Link>
              );
            }

            const isOverdue = getCareStatus(item.task) === 'overdue';
            const isPhotoTask = item.task.type === 'photo';

            return (
              <div
                key={item.key}
                className={`flex items-center gap-3 rounded-2xl border-l-4 bg-surface-glass p-3 shadow-card backdrop-blur-xl backdrop-saturate-150 ${
                  isOverdue ? 'border-danger' : 'border-info'
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-bg-tertiary text-lg">
                  {TASK_ICON[item.task.type]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm font-semibold text-text-primary">
                    {TASK_VERB[item.task.type]} {name}
                  </p>
                  <p className="truncate text-caption text-text-muted">
                    {formatDue(getNextDue(item.task))}
                  </p>
                </div>
                {isPhotoTask ? (
                  <label className="shrink-0 cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => void handleTaskPhoto(event, item.plant.id, item.task.id)}
                    />
                    Снять
                  </label>
                ) : (
                  <button
                    type="button"
                    onClick={() => void markDone(item.task.id)}
                    className="shrink-0 cursor-pointer rounded-full bg-brand px-3 py-1.5 text-caption font-semibold text-white"
                  >
                    Готово
                  </button>
                )}
              </div>
            );
          })}
          {!todayExpanded && todayItems.length > 3 && (
            <button
              type="button"
              onClick={() => setTodayExpanded(true)}
              className="cursor-pointer rounded-2xl border border-dashed border-surface-glass-border py-2.5 text-body-sm font-semibold text-text-secondary"
            >
              Показать ещё {todayItems.length - 3}
            </button>
          )}
        </div>
      )}

      <div className="mt-7 flex items-center justify-between">
        <p className="text-h3 text-text-primary">🌿 Коллекция</p>
        <Link to="/collection" className="text-body-sm font-semibold text-brand-pink">
          Все {activePlants.length} →
        </Link>
      </div>

      <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
        {activePlants.map((plant) => {
          const photo = plant.photos[0];
          const analysis = photo?.analysis;
          const name = analysis?.identification.commonName ?? plant.name;
          const dotClassName = analysis?.health.status
            ? healthBucketToDotClassName(healthStatusToBucket(analysis.health.status))
            : null;

          return (
            <Link
              key={plant.id}
              to={`/plant/${plant.id}`}
              className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-bg-tertiary shadow-card"
            >
              {photo?.imageUrl && (
                <img src={photo.imageUrl} alt={name} className="absolute inset-0 size-full object-cover" />
              )}
              <div className="absolute inset-0 bg-card-overlay" />
              {dotClassName && (
                <span
                  className={`absolute top-1.5 right-1.5 size-2.5 rounded-full border-2 border-white ${dotClassName}`}
                />
              )}
              <p className="absolute inset-x-0 bottom-1.5 truncate px-2 text-caption font-semibold text-white">
                {name}
              </p>
            </Link>
          );
        })}
      </div>

      <FAB onFileSelect={handleAddPlant} loading={addingPlant} />
      <Confetti active={celebrate} onDone={() => setCelebrate(false)} />
      <Toast message={toast} />
    </>
  );
};
