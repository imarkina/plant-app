import { Card } from '../../../../shared/ui/components/Card/Card';
import { Badge } from '../../../../shared/ui/components/Badge/Badge';
import type { PlantReport } from '../../models/plant-report.types';
import './IdentificationHeader.css';
import { confidenceToVariant } from '../../models/report-status.mappers';

type Props = {
  identification: PlantReport['identification'];
};

export const IdentificationHeader = ({ identification }: Props) => {
  return (
    <Card className="header-card">
      <div className="plant-title">
        <h1>{identification.commonName}</h1>
        <p className="botanical-name" id="botanicalName">
          {identification.botanicalName}
        </p>
      </div>
      <div>
        <Badge variant={confidenceToVariant(identification.confidencePercent)}>
          Уверенность: {identification.confidencePercent}
        </Badge>
      </div>
    </Card>
  );
};
