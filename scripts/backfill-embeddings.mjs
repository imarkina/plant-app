#!/usr/bin/env node
// Разовый бэкфилл эмбеддингов для диагнозов/сравнений, сохранённых до того,
// как их стали считать и кэшировать сразу при записи (см.
// src/features/plants/models/search-embeddings.ts). Идёт по всем
// пользователям — нужен service role key, чтобы обойти RLS.
//
// Запуск:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... GEMINI_API_KEY=... \
//     node scripts/backfill-embeddings.mjs

import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error(
    'Нужны SUPABASE_URL (или VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY и GEMINI_API_KEY в env.',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const genai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Модель и размерность — как в src/server/embed-text.ts.
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 768;
const PAGE_SIZE = 500;

// Тексты держим в точности как computeDiagnosisEmbedding/computeComparisonEmbedding
// в src/features/plants/models/search-embeddings.ts — поменяете там, поправьте и здесь.
function buildDiagnosisText(analysis) {
  return [analysis.health?.description, analysis.health?.diagnosis].filter(Boolean).join('. ');
}

function buildComparisonText(result) {
  return [
    result.summary?.headline,
    result.detailedAnalysis?.foliageAndShoots,
    result.detailedAnalysis?.problemAreas,
    result.detailedAnalysis?.overallHabit,
  ]
    .filter(Boolean)
    .join('. ');
}

async function embed(text) {
  const response = await genai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: { outputDimensionality: EMBEDDING_DIMENSIONS },
  });

  const values = response.embeddings?.[0]?.values;
  if (!values) {
    throw new Error('no embedding returned');
  }
  return values;
}

async function fetchAllNeedingEmbedding(table, selectColumns) {
  const rows = [];
  let from = 0;

  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select(selectColumns)
      .is('embedding', null)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

async function backfillPhotos() {
  const photos = (await fetchAllNeedingEmbedding('photos', 'id, analysis')).filter(
    (photo) => photo.analysis != null,
  );

  console.log(`photos: ${photos.length} с диагнозом без эмбеддинга`);

  let done = 0;
  let failed = 0;
  for (const photo of photos) {
    const text = buildDiagnosisText(photo.analysis);
    if (!text) continue;

    try {
      const embedding = await embed(text);
      const { error } = await supabase.from('photos').update({ embedding }).eq('id', photo.id);
      if (error) throw error;
      done += 1;
    } catch (e) {
      failed += 1;
      console.error(`photo ${photo.id}: ${e.message}`);
    }
  }

  console.log(`photos готово: ${done}, ошибок: ${failed}`);
}

async function backfillComparisons() {
  const comparisons = await fetchAllNeedingEmbedding('photo_comparisons', 'id, result');

  console.log(`photo_comparisons: ${comparisons.length} без эмбеддинга`);

  let done = 0;
  let failed = 0;
  for (const comparison of comparisons) {
    const text = buildComparisonText(comparison.result);
    if (!text) continue;

    try {
      const embedding = await embed(text);
      const { error } = await supabase
        .from('photo_comparisons')
        .update({ embedding })
        .eq('id', comparison.id);
      if (error) throw error;
      done += 1;
    } catch (e) {
      failed += 1;
      console.error(`comparison ${comparison.id}: ${e.message}`);
    }
  }

  console.log(`photo_comparisons готово: ${done}, ошибок: ${failed}`);
}

await backfillPhotos();
await backfillComparisons();
