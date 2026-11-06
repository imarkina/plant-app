const TOOL_LABELS: Record<string, string> = {
  match_care_knowledge: 'Ищу в базе знаний',
  search_similar_cases: 'Ищу похожие случаи',
  get_diagnosis_history: 'Смотрю историю диагнозов',
  list_plants: 'Смотрю ваши растения',
  get_watering_history: 'Смотрю историю полива',
  get_today_tasks: 'Смотрю задачи на сегодня',
  get_weather: 'Смотрю погоду',
  mark_task_done: 'Отмечаю задачу',
  get_care_guide: 'Открываю справочник по уходу',
};

export function toolLabel(tool: string): string {
  return TOOL_LABELS[tool] ?? 'Думаю…';
}
