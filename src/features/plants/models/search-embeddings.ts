import type { PlantReport } from './plant-report.types';
import type { PlantComparison } from './plant-comparison.types';
import { getEmbedding } from '../../search';

/** Без имени растения — иначе переименование сделало бы кэш эмбеддинга неактуальным без нового диагноза. */
function buildDiagnosisText(analysis: PlantReport): string {
  return [analysis.health.description, analysis.health.diagnosis].filter(Boolean).join('. ');
}

function buildComparisonText(result: PlantComparison): string {
  return [
    result.summary.headline,
    result.detailedAnalysis.foliageAndShoots,
    result.detailedAnalysis.problemAreas,
    result.detailedAnalysis.overallHabit,
  ]
    .filter(Boolean)
    .join('. ');
}

/** Эмбеддинг — вспомогательные данные для поиска по симптомам; его сбой не должен ронять сохранение диагноза. */
export async function computeDiagnosisEmbedding(analysis: PlantReport): Promise<number[] | null> {
  try {
    return await getEmbedding(buildDiagnosisText(analysis));
  } catch {
    return null;
  }
}

export async function computeComparisonEmbedding(result: PlantComparison): Promise<number[] | null> {
  try {
    return await getEmbedding(buildComparisonText(result));
  } catch {
    return null;
  }
}
