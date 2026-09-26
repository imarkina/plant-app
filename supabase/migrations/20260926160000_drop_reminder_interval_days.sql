-- reminder_interval_days никогда не читался ни одним реальным путём отправки
-- напоминаний (ни send-photo-reminders, ни задачами ухода) — только
-- сохранялся и отображался в профиле. Убираем мёртвую настройку.
alter table public.user_settings drop column if exists reminder_interval_days;
