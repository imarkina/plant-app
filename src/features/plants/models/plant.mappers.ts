import type { HealthStatus, ThreatLevel } from './plant-report.types';
import type { BadgeVariant } from '../../../shared/ui/components/Badge/Badge';

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
  if (confidencePercent > 80) {
    return 'success';
  }

  if (confidencePercent < 30) {
    return 'danger';
  }

  return 'neutral';
}