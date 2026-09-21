import { Card } from '../../../../shared/ui/components/Card/Card';
import { Badge } from '../../../../shared/ui/components/Badge/Badge';
import type { PlantReport } from '../../models/plant-report.types';
import {
  healthStatusToLabel,
  statusToVariant,
  threatLevelToLabel,
  threatToVariant,
} from '../../models/report-status.mappers';

type Props = {
  title: string;
  health: PlantReport['health'];
};

export const HealthSection = ({ health, title }: Props) => {
  return (
    <Card title={title}>
      <div className="mb-3 flex gap-2">
        {health.status && (
          <Badge variant={statusToVariant(health.status)}>
            Статус: {healthStatusToLabel(health.status)}
          </Badge>
        )}
        {health.threatLevel && (
          <Badge variant={threatToVariant(health.threatLevel)}>
            Угроза: {threatLevelToLabel(health.threatLevel)}
          </Badge>
        )}
      </div>
      <p className="text-body-sm text-text-primary">
        <strong>Диагноз:</strong> {health.diagnosis}
      </p>
      <p className="mt-1 text-body-sm text-text-secondary">{health.description}</p>
    </Card>
  );
};
