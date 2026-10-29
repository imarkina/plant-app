-- RAG-поиск по care_knowledge: ближайшие по смыслу чанки для эмбеддинга
-- запроса, с порогом похожести и опциональным фильтром по растению.
-- SECURITY INVOKER (по умолчанию) — та же RLS-политика care_knowledge
-- ("Authenticated users can read care knowledge") применяется и здесь, так
-- что отдельных грантов не требуется.

create or replace function public.match_care_knowledge(
  query_embedding extensions.vector(768),
  match_threshold float,
  match_count int,
  filter_species text default null
)
returns table (
  id uuid,
  species text,
  topic public.care_topic,
  content text,
  source_url text,
  similarity float
)
language sql
stable
as $$
  select
    care_knowledge.id,
    care_knowledge.species,
    care_knowledge.topic,
    care_knowledge.content,
    care_knowledge.source_url,
    1 - (care_knowledge.embedding <=> query_embedding) as similarity
  from public.care_knowledge
  where (filter_species is null or care_knowledge.species = filter_species)
    and 1 - (care_knowledge.embedding <=> query_embedding) > match_threshold
  order by care_knowledge.embedding <=> query_embedding
  limit match_count;
$$;
