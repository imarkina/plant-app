import type { PlantReport } from '../models/plant-report.types';
import './PlantReportView.css';
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
    <div className="report-container">
      <IdentificationHeader identification={analysis.identification} />
      <HealthSection title="Диагностика здоровья" health={analysis.health} />
      <ActionPlanSection title="План действий" actionPlan={analysis.actionPlan} />
    </div>
  );
};
