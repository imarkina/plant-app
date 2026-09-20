import { Card } from '../../../../shared/ui/components/Card/Card';
import { Badge } from '../../../../shared/ui/components/Badge/Badge';
import type { PlantReport } from '../../models/plant-report.types';
import { confidenceToVariant } from '../../models/report-status.mappers';

type Props = {
  identification: PlantReport['identification'];
};

export const IdentificationHeader = ({ identification }: Props) => {
  return (
    <Card className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-h3 text-text-primary">{identification.commonName}</h1>
        <p className="mt-1 text-body-sm text-text-muted italic">{identification.botanicalName}</p>
      </div>
      <Badge variant={confidenceToVariant(identification.confidencePercent)}>
        Уверенность: {identification.confidencePercent}
      </Badge>
    </Card>
  );
};
