import type { CareTask } from './care-tasks.model';

export function supabaseRowToCareTask(row: any): CareTask {
  return {
    id: row.id,
    plantId: row.plant_id,
    intervalDays: row.interval_days,
    lastDoneAt: row.last_done_at,
    type: row.type,
  };
}
