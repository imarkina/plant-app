import type { PlantReport } from '../models/plant-report.types';
import { IdentificationHeader } from './report/IdentificationHeader';
import { HealthSection } from './report/HealthSection';
import { ActionPlanSection } from './report/ActionPlanSection';

type Props = {
  analysis: PlantReport | null;
};

export const PlantReportView = ({ analysis }: Props) => {
  if (!analysis) {
    return null;
  }

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-6">
      <IdentificationHeader identification={analysis.identification} />
      <HealthSection title="Диагностика здоровья" health={analysis.health} />
      <ActionPlanSection title="План действий" actionPlan={analysis.actionPlan} />
    </div>
  );
};
