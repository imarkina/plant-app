import { supabase } from '../../../shared/supabase/client';
import type { CareTask, CareTasksRepository } from './care-tasks.model';
import { supabaseRowToCareTask, type SupabaseCareTaskRow } from './care-tasks.mappers';

class SupabaseCareTasksRepository implements CareTasksRepository {
  async getCareTasks(plantId: string): Promise<CareTask[]> {
    const { data, error } = await supabase.from('care_tasks').select('*').eq('plant_id', plantId);

    if (error) {
      throw error;
    }

    // `type` is the DB's generic text column, narrowed here to CareTaskType --
    // enforced by the table's own check constraint, see the migrations.
    return (data as SupabaseCareTaskRow[]).map(supabaseRowToCareTask);
  }

  async getCareTasksForPlants(plantIds: string[]): Promise<CareTask[]> {
    if (plantIds.length === 0) {
      return [];
    }

    const { data, error } = await supabase.from('care_tasks').select('*').in('plant_id', plantIds);

    if (error) {
      throw error;
    }

    return (data as SupabaseCareTaskRow[]).map(supabaseRowToCareTask);
  }

  async addCareTask(task: CareTask): Promise<void> {
    const { error } = await supabase.from('care_tasks').insert({
      id: task.id,
      plant_id: task.plantId,
      type: task.type,
      interval_days: task.intervalDays,
      last_done_at: task.lastDoneAt ? new Date(task.lastDoneAt).toISOString() : null,
    });

    if (error) {
      throw error;
    }
  }

  async markCareDone(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('care_tasks')
      .update({ last_done_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) {
      throw error;
    }
  }

  async updateCareTask(task: CareTask): Promise<void> {
    const { error } = await supabase
      .from('care_tasks')
      .update({
        interval_days: task.intervalDays,
        last_done_at: task.lastDoneAt ? new Date(task.lastDoneAt).toISOString() : null,
      })
      .eq('id', task.id);

    if (error) {
      throw error;
    }
  }
}

export const careTasksRepository = new SupabaseCareTasksRepository();
