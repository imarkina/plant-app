import type { ChangeEvent } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { pluralizeRu } from '../../../shared/helpers';
import { AddPlantButton } from '../../../shared/ui/components/AddPlantButton/AddPlantButton';

export type CollectionView = 'grid' | 'list';

type Props = {
  plantsCount: number;
  roomsCount: number;
  attentionCount: number;
  view: CollectionView;
  onViewChange: (view: CollectionView) => void;
  onAddPlantFile: (event: ChangeEvent<HTMLInputElement>) => void;
  addingPlant: boolean;
};

const VIEW_OPTIONS: { id: CollectionView; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'grid', label: 'Сетка', icon: LayoutGrid },
  { id: 'list', label: 'Список', icon: List },
];

export const CollectionHeader = ({
  plantsCount,
  roomsCount,
  attentionCount,
  view,
  onViewChange,
  onAddPlantFile,
  addingPlant,
}: Props) => {
  const stats = [
    `${plantsCount} ${pluralizeRu(plantsCount, 'растение', 'растения', 'растений')}`,
    `${roomsCount} ${pluralizeRu(roomsCount, 'комната', 'комнаты', 'комнат')}`,
    attentionCount > 0 ? `${attentionCount} требует внимания` : null,
  ].filter(Boolean);

  return (
    <div>
      <h1 className="text-h1 desktop:text-h1-lg text-text-primary">
        Моя{' '}
        <span className="bg-brand bg-clip-text text-transparent">коллекция</span>
      </h1>
      <p className="mt-1 text-body-sm desktop:text-body-sm-lg text-text-muted">
        {stats.join(' · ')}
      </p>

      <div className="mt-4 flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <div className="inline-flex gap-1 self-start rounded-full border border-surface-glass-border bg-surface-glass p-1 backdrop-blur-xl backdrop-saturate-150">
          {VIEW_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => onViewChange(id)}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-body-sm font-sans font-medium transition-all duration-100 ${
                view === id
                  ? 'bg-bg-elevated text-text-primary shadow-card'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        <AddPlantButton onFileSelect={onAddPlantFile} loading={addingPlant} className="w-full desktop:w-auto" />
      </div>
    </div>
  );
};
