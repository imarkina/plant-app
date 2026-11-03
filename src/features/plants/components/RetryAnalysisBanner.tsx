import { RefreshCw } from 'lucide-react';
import type { PhotoEntry, Plant } from '../models/plant.types';
import { useRetryAnalysis } from '../hooks/useRetryAnalysis';
import { emitToast } from '../../../shared/ui/toast/toastBus';

type Props = {
  plant: Plant;
  photo: PhotoEntry;
};

/** Показывается вместо секции «Диагностика», когда AI-анализ не сохранился при загрузке фото — предлагает перезапустить его на том же снимке. */
export const RetryAnalysisBanner = ({ plant, photo }: Props) => {
  const { retry, loading, error } = useRetryAnalysis(plant.id);

  const handleRetry = async () => {
    const succeeded = await retry(photo);
    if (succeeded) {
      emitToast('Анализ обновлён 🌿', 'success');
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-warn/25 bg-warn-soft p-4 shadow-card">
      <p className="text-body-sm font-semibold text-text-primary">
        Не удалось распознать растение по фото
      </p>
      <p className="mt-1 text-body-sm text-text-secondary">
        Диагностика и параметры ухода появятся после повторного анализа этого снимка.
      </p>
      {error && <p className="mt-2 text-body-sm text-danger">{error}</p>}
      <button
        type="button"
        onClick={() => void handleRetry()}
        disabled={loading}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-body-sm font-semibold text-white disabled:opacity-50"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Анализируем...' : 'Повторить анализ'}
      </button>
    </div>
  );
};
