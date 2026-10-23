import type { CareTask, CareTaskType } from './care-tasks.model';

interface SupabaseCareTaskRow {
  id: string;
  plant_id: string;
  interval_days: number;
  last_done_at: string | null;
  type: CareTaskType;
}

export function supabaseRowToCareTask(row: SupabaseCareTaskRow): CareTask {
  return {
    id: row.id,
    plantId: row.plant_id,
    intervalDays: row.interval_days,
    lastDoneAt: row.last_done_at ? new Date(row.last_done_at).getTime() : null,
    type: row.type,
  };
}
