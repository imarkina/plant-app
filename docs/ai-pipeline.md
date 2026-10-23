# AI pipeline

How a photo turns into a diagnosis, a care schedule, and a searchable embedding. Read this
before touching anything under `api/*` or `src/server/*`.

## Why it's split across two layers

The browser never calls Gemini directly — there is no Gemini API key in the client bundle.
Every AI call goes: **client → Vercel Edge Function (`api/*.ts`) → `src/server/*.ts` → `@google/genai`**.
The `api/*.ts` files are intentionally thin: parse the request, call the matching `src/server/*.ts`
function, return its result or a `{ error }` JSON with a 400/500. All prompt text, schema, and
the actual Gemini call live in `src/server/*.ts`, not in the edge handler.

`src/server/client.ts` creates the single `GoogleGenAI` instance from `process.env.GEMINI_API_KEY`
— this only resolves server-side (Vercel edge runtime / Supabase edge function), never in the
browser.

## The three endpoints

### `POST /api/analyze` → `analyzePlantImage`

`api/analyze.ts` → `src/server/analyze-plant-image.ts`.

Input: `{ image: base64string, mimeType }`. Calls `gemini-3.6-flash` with the photo as
`inlineData` plus a long Russian prompt (botanist/phytopathologist persona) asking for
identification, health diagnosis, an action plan, and a care passport. Structured output is
enforced via `config.responseJsonSchema: z.toJSONSchema(plantReportSchema)` — the Zod schema in
`analyze-plant-image.shema.ts` is the actual contract; if you need to add a field to what Gemini
returns, add it there first, then the prompt will shape Gemini's output to match, and
`plantReportSchema.parse(raw)` will reject anything that drifts. Returns a `PlantReport`:
`identification`, `health`, `actionPlan`, `carePassport`.

**Consumers of the result** (client-side, not in this file):
- Stored on the photo row by `plant.repository.ts` (`updatePhotoAnalysis`).
- `useApplyCarePassport` (`features/care-tasks`) reads `carePassport` and upserts `care_tasks`
  rows (watering/feeding/misting intervals) so the schedule reflects what Gemini recommended for
  *that specific plant*, not a hardcoded default. This runs after every new diagnosis: plant
  creation, new photo, or a retried analysis.
- The photo's text gets embedded (see below) and cached for semantic search.

### `POST /api/compare` → `comparePlants`

`api/compare.ts` → `src/server/compare-plants.ts`.

Input: `{ base64First, base64Last, analysisFirst, analysisLast, mimeType }` — two photos of the
same plant plus their prior `PlantReport` JSON as context. Same model
(`gemini-3.6-flash`), same structured-output mechanism (`compare-plants.schema.ts` +
`responseJsonSchema`), different prompt: asks for a verdict on care-plan effectiveness (better /
worse / neutral), a detailed before/after comparison, and adjustments to the care plan. Returns
a `PlantComparisonSchema`.

Persisted via `plant-comparison.repository.ts`; `usePlantComparison` is what triggers this from
the UI (comparing two timeline photos).

### `POST /api/embed` → `embedText`

`api/embed.ts` → `src/server/embed-text.ts`.

Input: `{ text }`. Calls `gemini-embedding-001` (via `embedContent`, not `generateContent` — a
different model family, no structured-output schema involved) with
`outputDimensionality: 768`. Returns a plain `number[]`.

Used for semantic symptom/species search (`features/search`): `search/model/similarity.ts` does
plain cosine similarity in JS over whatever embeddings are passed in — there is no vector DB or
`pgvector` query involved, so this doesn't scale past "all of one user's plants" without
rethinking.

**Caching matters here**: a diagnosis's/comparison's embedding is computed once and stored on
its row (`embedding` column — see `plant.repository.ts`'s `updatePhotoAnalysis` and the
`20260926150000_add_diagnosis_embeddings.sql` migration), not recomputed on every read. Rows that
predate this column are backfilled by `scripts/backfill-embeddings.mjs`
(`npm run backfill:embeddings`), which calls the *deployed* `/api/embed` endpoint rather than
`embedText` directly — so it needs `VERCEL_URL`/a live deployment to run against, it isn't a
pure local script.

## If you're changing a schema

`plantReportSchema` / `plantComparisonSchema` (Zod) are the single source of truth for both
"what Gemini is asked to return" (via `z.toJSONSchema`) and "what the client is allowed to
trust" (via `.parse()`). Changing the shape of a diagnosis or comparison means changing the Zod
schema in `src/server/*.schema.ts` — the prompt strings describe the same fields in prose for
Gemini's benefit, so update both together or the prompt and the schema will disagree about what
exists.
