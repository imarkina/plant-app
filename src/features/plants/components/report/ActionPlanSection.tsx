import { Card } from '../../../../shared/ui/components/Card/Card';
import type { PlantReport } from '../../models/plant-report.types';

type Props = {
  title: string;
  actionPlan: PlantReport['actionPlan'];
};

export const ActionPlanSection = ({ actionPlan, title }: Props) => {
  return (
    <Card title={title}>
      <div className="mb-4">
        <h3 className="mb-2 text-body font-semibold text-warn">Сделать прямо сейчас:</h3>
        <ul className="list-disc space-y-2 pl-6 text-body-sm text-text-primary">
          {actionPlan.urgentActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

      <hr className="border-surface-glass-border" />

      <div className="mt-4">
        <h3 className="mb-2 text-body font-semibold text-danger">Категорически запрещено:</h3>
        <ul className="list-disc space-y-2 pl-6 text-body-sm text-text-primary">
          {actionPlan.prohibitions.map((prohibition) => (
            <li key={prohibition}>{prohibition}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
