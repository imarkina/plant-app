import { Card } from '../../../../shared/ui/components/Card/Card';
import type { PlantReport } from '../../models/plant-report.types';
import './CarePassportSection.css';
import { CareItem } from './CareItem';

type Props = {
  title: string;
  carePassport: PlantReport['carePassport'];
};

export const CarePassportSection = ({ title, carePassport }: Props) => {
  return (
    <Card title={title}>
      <div className="grid-2">
        <CareItem title="Освещение">
          <p>
            <strong>{carePassport.lighting.summary}</strong>
          </p>
          <p className="details">Идеал: {carePassport.lighting.idealPlacement}</p>
          <p className="details">{carePassport.lighting.details}</p>
        </CareItem>

        <CareItem title="Полив">
          <p>{carePassport.watering.frequency}</p>
          <p className="details">Вода: {carePassport.watering.waterQuality}</p>
        </CareItem>

        <CareItem title="Климат и Влажность">
          <p>
            Влажность: <strong>{carePassport.environment.humidity}</strong>
          </p>
          <p>
            Температура: <strong>{carePassport.environment.temperatureOptimal}</strong> (мин:{' '}
            <span>{carePassport.environment.temperatureMinC}</span>°C)
          </p>
          <p className="details">{carePassport.environment.notes}</p>
        </CareItem>

        <CareItem title="Почва и Горшок">
          <p>
            <strong>Грунт:</strong> <span>{carePassport.soilAndPot.soilMix}</span>
          </p>
          <p className="details">
            <strong>Горшок:</strong> <span>{carePassport.soilAndPot.potType}</span>
          </p>
          <p className="details">
            <strong>Пересадка:</strong> <span>{carePassport.soilAndPot.repottedWhen}</span>
          </p>
        </CareItem>

        <CareItem title="Подкормка" fullWidth>
          <p>
            {carePassport.fertilizing.schedule} — <strong>{carePassport.fertilizing.dosage}</strong>
          </p>
          <p className="details">{carePassport.fertilizing.warnings}</p>
        </CareItem>
      </div>
    </Card>
  );
};
