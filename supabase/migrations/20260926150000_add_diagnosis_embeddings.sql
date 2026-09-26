-- Кэш эмбеддингов для поиска по симптомам: считаем один раз при сохранении
-- нового диагноза/сравнения фото, а не при каждом открытии поиска.
alter table public.photos
  add column if not exists embedding double precision[];

alter table public.photo_comparisons
  add column if not exists embedding double precision[];
