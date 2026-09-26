import type { ReactNode } from 'react';
import type { PlantReport } from '../../plants/models/plant-report.types';

type Props = {
  carePassport: PlantReport['carePassport'] | undefined;
};

const Field = ({ label, value }: { label: string; value: string | undefined }) => {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt className="text-text-muted">{label}</dt>
      <dd className="mt-0.5 text-text-primary">{value}</dd>
    </div>
  );
};

const Category = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <p className="text-caption font-semibold text-text-muted uppercase">{title}</p>
    <dl className="mt-2 flex flex-col gap-2 text-body-sm">{children}</dl>
  </div>
);

export const CarePassportSection = ({ carePassport }: Props) => {
  if (!carePassport) {
    return null;
  }

  const { lighting, watering, environment, soilAndPot, fertilizing } = carePassport;

  return (
    <div className="mt-6">
      <p className="text-h3 text-text-primary">🪴 Паспорт ухода</p>
      <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
        <Category title="Освещение">
          <Field label="Свет" value={lighting.summary} />
          <Field label="Детали" value={lighting.details} />
          <Field label="Идеальное место" value={lighting.idealPlacement} />
        </Category>

        <hr className="border-surface-glass-border" />

        <Category title="Полив">
          <Field label="Правило" value={watering.frequency} />
          <Field label="Качество воды" value={watering.waterQuality} />
        </Category>

        <hr className="border-surface-glass-border" />

        <Category title="Микроклимат">
          <Field
            label="Минимальная температура"
            value={
              environment.temperatureMinC != null ? `${environment.temperatureMinC}°C` : undefined
            }
          />
          <Field label="Примечания" value={environment.notes} />
        </Category>

        <hr className="border-surface-glass-border" />

        <Category title="Грунт и горшок">
          <Field label="Состав грунта" value={soilAndPot.soilMix} />
          <Field label="Горшок" value={soilAndPot.potType} />
          <Field label="Когда пересаживать" value={soilAndPot.repottedWhen} />
        </Category>

        <hr className="border-surface-glass-border" />

        <Category title="Подкормка">
          <Field label="График" value={fertilizing.schedule} />
          <Field label="Дозировка" value={fertilizing.dosage} />
          <Field label="Ограничения" value={fertilizing.warnings} />
        </Category>
      </div>
    </div>
  );
};
