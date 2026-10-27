#!/usr/bin/env node
// Загружает справочники по уходу knowledge/*.md в care_knowledge (источник
// для RAG по уходу за растениями) — одна строка на тему по растению.
// Компаньон backfill-embeddings.mjs: тот же приём с эмбеддингом через уже
// задеплоенный /api/embed вместо прямого вызова Gemini (см. комментарий там
// про геоблок и единый GEMINI_API_KEY).
//
// Формат knowledge/<plant>.md:
//   # <Название растения>
//   ## watering
//   <текст>
//   ## light
//   <текст>
//   ...
//   ## sources
//   <любой текст>
//   - <первый URL — он идёт в source_url всех чанков этого файла>
//   - <остальные URL игнорируются>
//
// `## <слово>` должно быть либо значением enum care_topic, либо `sources` —
// иначе скрипт останавливается с ошибкой форматирования, не записав ничего.
//
// Повторный запуск идемпотентен: перед вставкой чанков растения удаляются
// его старые чанки (по точному совпадению species).
//
// Запуск:
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... APP_URL=https://<ваш-домен> \
//     node scripts/load-knowledge.mjs
// (или `npm run load:knowledge`, если переменные уже лежат в .env — см. ниже)

import { createClient } from '@supabase/supabase-js';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

try {
  // Node 20.12+/21.7+: подхватывает .env из корня проекта, если он есть.
  // SUPABASE_SERVICE_ROLE_KEY намеренно без префикса VITE_ — это ключ с
  // доступом в обход RLS, он не должен попасть ни в один клиентский бандл.
  process.loadEnvFile();
} catch {
  // Нет .env рядом — ничего страшного, если переменные уже заданы в shell.
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !APP_URL) {
  console.error('Нужны SUPABASE_URL (или VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY и APP_URL в env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
const EMBED_ENDPOINT = new URL('/api/embed', APP_URL).toString();

const KNOWLEDGE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'knowledge');

// Должно совпадать с enum care_topic в
// supabase/migrations/20261027120000_add_care_knowledge.sql.
const CARE_TOPICS = ['watering', 'light', 'humidity', 'feeding', 'temperature', 'soil', 'diseases'];

const TOPIC_LABELS = {
  watering: 'Полив',
  light: 'Освещение',
  humidity: 'Влажность',
  feeding: 'Подкормка',
  temperature: 'Температура',
  soil: 'Грунт',
  diseases: 'Болезни',
};

/** Разбирает один файл на { species, sourceUrl, chunks }, ничего не трогая в базе. */
function parseKnowledgeFile(fileName, raw) {
  const lines = raw.split('\n');

  const species = (lines[0] ?? '').replace(/^#\s*/, '').trim();
  if (!species) {
    throw new Error(`${fileName}: не нашла название растения в первой строке`);
  }

  const chunks = [];
  let sourceUrl = null;
  let currentTopic = null;
  let currentLines = [];
  let inSources = false;

  const flushChunk = () => {
    if (currentTopic) {
      const content = currentLines.join(' ').replace(/\s+/g, ' ').trim();
      chunks.push({ topic: currentTopic, content });
    }
    currentLines = [];
  };

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^##\s+(\S+)/);

    if (headingMatch) {
      flushChunk();
      const heading = headingMatch[1];

      if (heading === 'sources') {
        inSources = true;
        currentTopic = null;
        continue;
      }

      if (!CARE_TOPICS.includes(heading)) {
        throw new Error(
          `${fileName}: тема "${heading}" не входит в care_topic (${CARE_TOPICS.join(', ')})`,
        );
      }

      inSources = false;
      currentTopic = heading;
      continue;
    }

    if (inSources) {
      if (sourceUrl === null) {
        const urlMatch = line.match(/^-\s*(\S+)/);
        if (urlMatch) sourceUrl = urlMatch[1];
      }
      continue;
    }

    if (currentTopic) {
      currentLines.push(line.trim());
    }
  }

  flushChunk();

  return { species, sourceUrl, chunks };
}

async function embed(text) {
  const response = await fetch(EMBED_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });

  const body = await response.json();
  if (!response.ok || !body.embedding) {
    throw new Error(body.error ?? `embed failed: HTTP ${response.status}`);
  }
  return body.embedding;
}

async function loadPlant({ species, sourceUrl, chunks }) {
  const { error: deleteError } = await supabase.from('care_knowledge').delete().eq('species', species);
  if (deleteError) throw deleteError;

  const rows = [];
  for (const chunk of chunks) {
    const text = `${species} — ${TOPIC_LABELS[chunk.topic]}. ${chunk.content}`;
    const embedding = await embed(text);
    rows.push({ species, topic: chunk.topic, content: chunk.content, embedding, source_url: sourceUrl });
  }

  const { error: insertError } = await supabase.from('care_knowledge').insert(rows);
  if (insertError) throw insertError;

  return rows.length;
}

const fileNames = (await readdir(KNOWLEDGE_DIR)).filter((name) => name.endsWith('.md')).sort();

if (fileNames.length === 0) {
  console.error(`В ${KNOWLEDGE_DIR} нет .md файлов.`);
  process.exit(1);
}

// Фаза 1: разобрать и провалидировать формат всех файлов, не трогая базу —
// если хоть один файл невалиден, не пишем в care_knowledge вообще ничего.
const plants = [];
for (const fileName of fileNames) {
  const raw = await readFile(path.join(KNOWLEDGE_DIR, fileName), 'utf8');
  try {
    plants.push(parseKnowledgeFile(fileName, raw));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

// Фаза 2: эмбеддинги + запись, растение за растением.
let totalChunks = 0;
for (const plant of plants) {
  try {
    const count = await loadPlant(plant);
    totalChunks += count;
    console.log(`${plant.species}: ${count} чанков`);
  } catch (e) {
    console.error(`${plant.species}: ошибка записи — ${e.message}`);
    process.exit(1);
  }
}

console.log(`Готово: ${totalChunks} чанков по ${plants.length} растениям.`);

// См. комментарий в backfill-embeddings.mjs про зависание Node/undici на Windows.
process.exit(0);
