alter table public.care_knowledge
    add column fts tsvector
        generated always as (to_tsvector('russian', content)) stored;

create index care_knowledge_fts_idx
    on public.care_knowledge using gin (fts);