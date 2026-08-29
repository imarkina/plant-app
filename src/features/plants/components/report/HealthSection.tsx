import { Card } from '../../../../shared/ui/components/Card/Card';
import { Badge } from '../../../../shared/ui/components/Badge/Badge';
import type { PlantReport } from '../../models/plant-report.types';
import { statusToVariant, threatToVariant } from '../../models/report-status.mappers';

type Props = {
  title: string;
  health: PlantReport['health'];
};

export const HealthSection = ({ health, title }: Props) => {
  return (
    <Card title={title}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {health.status && (
          <Badge variant={statusToVariant(health.status)}>Статус: {health.status}</Badge>
        )}
        {health.threatLevel && (
          <Badge variant={threatToVariant(health.threatLevel)}>Угроза: {health.threatLevel}</Badge>
        )}
      </div>
      <p>
        <strong>Диагноз:</strong> <span>{health.diagnosis}</span>
      </p>
      <p>{health.description}</p>
    </Card>
  );
};
