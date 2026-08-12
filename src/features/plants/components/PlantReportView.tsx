import type { PlantReport } from '../models/plant-report.types';
import './PlantReportView.css';
import { IdentificationHeader } from './report/IdentificationHeader';
import { HealthSection } from './report/HealthSection';
import { ActionPlanSection } from './report/ActionPlanSection';
import { CarePassportSection } from './report/CarePassportSection';

type Props = {
  loading: boolean;
  error: string | null;
  analysis: PlantReport | null;
};

export const PlantReportView = ({ loading, analysis, error }: Props) => {
  if (loading) {
    return <p>анализируем...</p>;
  }

  if (error) {
    return <p>ошибка: {error}</p>;
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="report-container">
      <IdentificationHeader identification={analysis.identification} />
      <HealthSection title="Диагностика здоровья" health={analysis.health} />
      <ActionPlanSection title="План действий" actionPlan={analysis.actionPlan} />
      <CarePassportSection title="Паспорт ухода" carePassport={analysis.carePassport} />
    </div>
  );
};
