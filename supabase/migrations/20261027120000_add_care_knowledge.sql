-- База знаний об уходе за растениями для RAG.
-- Общий справочник, как `species`: одинаков для всех пользователей, поэтому без user_id.
-- Каждая строка — один чанк: одна тема по одному растению, с названием растения в тексте.
-- Наполняется только админом (скриптом с service-ключом); пользователи могут лишь читать.

create extension if not exists vector with schema extensions;

create type public.care_topic as enum (
  'watering',
  'light',
  'humidity',
  'feeding',
  'temperature',
  'soil',
  'diseases'
);

create table if not exists public.care_knowledge (
                                                     id uuid primary key default gen_random_uuid(),
    species text not null,
    topic public.care_topic not null,
    content text not null,
    embedding extensions.vector(768) not null,  -- gemini-embedding-001, 768 измерений, как в embed-text.ts
    source_url text,                            -- пусто = карточка ещё не проверена по источнику
    created_at timestamptz not null default now()
    );

-- Индекс для быстрого поиска по смыслу (косинусное сходство)
create index if not exists care_knowledge_embedding_idx
    on public.care_knowledge
    using hnsw (embedding extensions.vector_cosine_ops);

-- Индекс для фильтра по растению перед поиском
create index if not exists care_knowledge_species_idx
    on public.care_knowledge (species);

alter table public.care_knowledge enable row level security;

-- Читать могут все залогиненные. Политик на запись нет — значит, через приложение писать нельзя.
create policy "Authenticated users can read care knowledge"
  on public.care_knowledge for select
                                          to authenticated
                                          using (true);