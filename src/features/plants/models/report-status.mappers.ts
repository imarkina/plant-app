import type { HealthStatus, ThreatLevel } from './plant-report.types';
import type { BadgeVariant } from '../../../shared/ui/components/Badge/Badge';

const HIGH_CONFIDENCE_THRESHOLD_PERCENT = 80;
const LOW_CONFIDENCE_THRESHOLD_PERCENT = 30;

export function statusToVariant(status: HealthStatus): BadgeVariant {
  switch (status) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'fair':
      return 'neutral';
    case 'poor':
    case 'critical':
      return 'danger';
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function threatToVariant(level: ThreatLevel): BadgeVariant {
  switch (level) {
    case 'low':
      return 'success';
    case 'medium':
      return 'neutral';
    case 'high':
    case 'critical':
      return 'danger';
    default: {
      const _exhaustive: never = level;
      return _exhaustive;
    }
  }
}

export function confidenceToVariant(confidencePercent: number): BadgeVariant {
  if (confidencePercent > HIGH_CONFIDENCE_THRESHOLD_PERCENT) {
    return 'success';
  }

  if (confidencePercent < LOW_CONFIDENCE_THRESHOLD_PERCENT) {
    return 'danger';
  }

  return 'neutral';
}
