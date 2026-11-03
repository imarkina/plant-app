import { Minus, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import type { CompareStatus } from './plant-report.types';

export interface ComparisonTrendMeta {
  Icon: LucideIcon;
  label: string;
  variant: CompareStatus;
}

export function getComparisonTrendMeta(status: CompareStatus): ComparisonTrendMeta {
  switch (status) {
    case 'positive':
      return { Icon: TrendingUp, label: 'Динамика улучшилась', variant: 'positive' };
    case 'negative':
      return { Icon: TrendingDown, label: 'Состояние ухудшилось', variant: 'negative' };
    case 'neutral':
      return { Icon: Minus, label: 'Динамика стабильна', variant: 'neutral' };
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}
