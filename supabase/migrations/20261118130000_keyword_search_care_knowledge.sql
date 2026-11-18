create or replace function public.keyword_search_care_knowledge(
  query_text text,
  filter_species text,
  match_count int
)
returns table (content text, topic public.care_topic, source_url text, rank float)
language sql stable
as $$
  with q as (
    select replace(plainto_tsquery('russian', query_text)::text, '&', '|')::tsquery as query
  )
select content, topic, source_url, ts_rank(fts, q.query) as rank
from public.care_knowledge, q
where species = filter_species and fts @@ q.query
order by rank desc
    limit match_count;
$$;