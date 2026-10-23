# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A PWA for diagnosing and tracking houseplants: photograph a plant, Gemini returns a structured
health diagnosis + care passport, the app turns that into scheduled care tasks and push
reminders. React 19 + TypeScript + Vite frontend, Supabase (Postgres + Auth + Storage + Edge
Functions) as the backend, Vercel Edge Functions as the only server-side code that talks to
Gemini.

## Commands

- `npm run dev` — Vite dev server.
- `npm run build` — `tsc -b` (type-check via `tsconfig.app.json`/`tsconfig.node.json`) then
  `vite build`. A type error fails the build even if Vite would otherwise succeed.
- `npm run lint` — ESLint. `src/**` gets full type-aware linting (`recommendedTypeChecked`);
  everything else (Storybook config, `api/*.ts` edge handlers, root tool configs) is excluded
  from the TS project and only gets syntax-level rules — don't expect type-aware lint errors
  there.
- `npm test` — `vitest run`, Node environment, only `src/**/*.test.ts` (co-located with the code
  they test, e.g. `care-tasks.helpers.test.ts` next to `care-tasks.helpers.ts`). To run a single
  file: `npx vitest run src/features/care-tasks/models/care-tasks.helpers.test.ts`.
- `npm run storybook` / `npm run build-storybook` — component stories in `src/stories/`.
- `npm run backfill:embeddings` — one-off script (`scripts/backfill-embeddings.mjs`) that calls
  the deployed `/api/embed` to fill in embeddings for diagnoses/comparisons that predate the
  embedding-cache column.

## Environment variables

Frontend (`VITE_`-prefixed, read via `import.meta.env`, declared in `src/vite-env.d.ts`):
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_VAPID_PUBLIC_KEY` (optional — push subscribe
degrades to a local-only toggle without it, see `usePushSubscription`).

Server-side (Vercel edge functions + Supabase edge function, read via `process.env`):
`GEMINI_API_KEY` — same key is used in both places; if it's rotated, update it in both.

## Architecture

**Feature-folder structure.** `src/features/<name>/` holds `components/`, `hooks/`,
`models/` (repository + types + mappers + pure helpers), and sometimes `context/`, each with a
barrel `index.ts` that's the only thing other features/pages should import from. `src/pages/`
compose features into routes; `src/shared/` holds cross-feature primitives (`ui/components`,
`supabase/client.ts`, `query/queryClient.ts`, `image/`). Current features: `auth`, `plants`,
`care-tasks`, `calendar`, `locations`, `species`, `reminders`, `search`.

**Repository pattern.** Each feature's `models/*.repository.ts` is a class wrapping Supabase
calls (`SupabasePlantsRepository`, etc.) behind an interface, with all Supabase responses passed
through `shared/supabase/unwrap.ts` (throws on `error`, returns non-null `data` — so repository
methods never return a `PostgrestError`-shaped value, they either resolve or throw). Hooks call
the repository and wrap it in TanStack Query (`useQuery`/`useMutation`); components never import
`supabase` directly. Mutation errors are *not* caught per-call — `queryClient.ts` wires a single
`MutationCache.onError` that logs and shows one generic toast for every failed mutation
app-wide, so don't add local try/catch+toast in individual mutation hooks.

**AI pipeline (client → edge function → Gemini → client → Supabase).** The browser never calls
Gemini directly (no API key in the client bundle). Flow: client base64-encodes a photo →
`POST /api/analyze` (Vercel Edge Function, `api/analyze.ts`) → `src/server/analyze-plant-image.ts`
calls `@google/genai` with `responseJsonSchema: z.toJSONSchema(plantReportSchema)` for
structured output → client receives a `PlantReport` (identification, health, actionPlan,
carePassport) → stored on the photo row (`plant.repository.ts`) → `useApplyCarePassport` derives
watering/feeding/misting intervals from `carePassport` and upserts `care_tasks` rows so the
schedule tracks what Gemini actually recommended for *that* plant, not hardcoded defaults.
`api/compare.ts` / `compare-plants.ts` does the same for before/after photo comparisons.
`api/embed.ts` / `embed-text.ts` generates embeddings for symptom/species semantic search
(`features/search`, cosine similarity in `search/model/similarity.ts`); embeddings for
diagnoses/comparisons are cached on the row instead of recomputed on read (see
`scripts/backfill-embeddings.mjs` for pre-existing rows).

**Supabase as the whole backend.** `supabase/migrations/*.sql` is the source of truth for the
schema — read the most recent ones before changing any table shape; several contain design-notes
comments explaining *why* a column is modeled a particular way (e.g. `light_level` enum vs.
`has_grow_light` boolean kept separate, `care_tasks` vs. `plant_care_logs` serving schedule vs.
history). Row-level security scopes every per-user table by `user_id = auth.uid()`; `species` is
an intentionally unscoped shared read-only catalog. `supabase/functions/send-photo-reminders/`
is a Supabase Edge Function (Deno), not a Vercel one — it's the scheduled job that sends push
reminders, separate from the Vercel `api/*.ts` functions that serve the SPA.

**Push notifications.** `usePushSubscription` (features/reminders) does real
`PushManager.subscribe()` plumbing against `/sw.js` and persists the subscription to
`push_subscriptions`; delivery is handled server-side by the Supabase edge function above using
the VAPID keypair. `public/push-sw.js` holds the `push`/`notificationclick` handlers and is
pulled into the generated service worker via `vite-plugin-pwa`'s `workbox.importScripts` (see
`vite.config.ts`) — it is not the service worker itself.

**Responsive layout, not responsive CSS alone.** Tailwind v4 (`@tailwindcss/vite`, no
`tailwind.config.*` — config lives in `src/shared/ui/tokens.css`). Below `desktop:` breakpoint,
`BottomNav` is the primary nav and pages render as a single mobile column; at `desktop:` and
above, `Sidebar` becomes the nav and `App.tsx`'s `PlantsLayout` adds `desktop:pl-60` plus a
re-centered max-width wrapper — `Sidebar`/`BottomNav` each hide themselves at the breakpoint
rather than being conditionally rendered, so don't assume only one of them exists in the tree.
Routes are lazy-loaded (`lazy(() => import(...))`) per page specifically to keep the initial
bundle under ~650 kB.
