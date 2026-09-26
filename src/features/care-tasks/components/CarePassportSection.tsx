import type { PlantReport } from '../../plants/models/plant-report.types';

type Props = {
  carePassport: PlantReport['carePassport'] | undefined;
};

export const CarePassportSection = ({ carePassport }: Props) => {
  if (!carePassport) {
    return null;
  }

  return (
    <div className="mt-6">
      <p className="text-h3 text-text-primary">🪴 Грунт и удобрения</p>
      <div className="mt-3 rounded-2xl border border-surface-glass-border bg-surface-glass p-4 shadow-card backdrop-blur-xl backdrop-saturate-150">
        <p className="text-caption font-semibold text-text-muted uppercase">Подкормка</p>
        <dl className="mt-2 flex flex-col gap-2 text-body-sm">
          <div>
            <dt className="text-text-muted">График</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.fertilizing.schedule}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Дозировка</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.fertilizing.dosage}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Ограничения</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.fertilizing.warnings}</dd>
          </div>
        </dl>

        <hr className="my-4 border-surface-glass-border" />

        <p className="text-caption font-semibold text-text-muted uppercase">Грунт и горшок</p>
        <dl className="mt-2 flex flex-col gap-2 text-body-sm">
          <div>
            <dt className="text-text-muted">Состав грунта</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.soilAndPot.soilMix}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Горшок</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.soilAndPot.potType}</dd>
          </div>
          <div>
            <dt className="text-text-muted">Когда пересаживать</dt>
            <dd className="mt-0.5 text-text-primary">{carePassport.soilAndPot.repottedWhen}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};
