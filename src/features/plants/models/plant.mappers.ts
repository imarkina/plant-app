import type { HealthStatus, ThreatLevel } from './plant-report.types';
import type { BadgeVariant } from '../../../shared/ui/components/Badge/Badge';
import type { PhotoEntry, Plant } from './plant.types';

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

export function supbaseRowToPlant(row: any): Plant {
  return {
    id: row.id,
    name: row.name,
    photos: row.photos.map(supbaseRowToPhotoEntry),
  };
}

export function supbaseRowToPhotoEntry(row: any): PhotoEntry {
  return {
    id: row.id,
    createdAt: new Date(row.created_at).getTime(),
    imageUrl: row.image_url,
    analysis: row.analysis,
  };
}
