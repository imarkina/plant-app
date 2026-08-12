import { Card } from '../../../../shared/ui/components/Card/Card';
import type { PlantReport } from '../../models/plant-report.types';
import './ActionPlanSection.css';

type Props = {
  title: string;
  actionPlan: PlantReport['actionPlan'];
};

export const ActionPlanSection = ({ actionPlan, title }: Props) => {
  return (
    <Card title={title}>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-accent)', marginBottom: '8px' }}>
          Сделать прямо сейчас:
        </h3>
        <ul className="actions-list">
          {actionPlan.urgentActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

      <hr />

      <div>
        <h3 style={{ fontSize: '1rem', color: 'var(--color-accent)', marginBottom: '8px' }}>
          Категорически запрещено:
        </h3>
        <ul className="prohibitions-list">
          {actionPlan.prohibitions.map((prohibition) => (
            <li key={prohibition}>{prohibition}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
