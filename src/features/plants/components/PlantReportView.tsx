import type { PlantReport } from '../models/plant-report.types';

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
    <div>
      <p>botanicalName: {analysis.identification.botanicalName}</p>
      <p>commonName: {analysis.identification.commonName}</p>
      <p>confidencePercent: {analysis.identification.confidencePercent}</p>
    </div>
  );
};
