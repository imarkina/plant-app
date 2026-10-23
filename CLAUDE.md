# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A PWA for diagnosing and tracking houseplants: photograph a plant, Gemini returns a structured
health diagnosis + care passport, the app turns that into scheduled care tasks and push
reminders. React 19 + TypeScript + Vite frontend, Supabase (Postgres + Auth + Storage + Edge
Functions) as the backend, Vercel Edge Functions as the only server-side code that talks to
Gemini.

## Rules

- No `any` — `tsconfig.app.json` has `strict: true` and the codebase currently has zero `any`/
  `as any`; don't introduce the first one.
- No raw colors — every color is a token from `src/shared/ui/tokens.css`'s `@theme` block
  (`--color-*`), referenced as a Tailwind class (`bg-bg-primary`, `text-accent`, ...). There are
  no arbitrary-value color classes (`bg-[#...]`) anywhere in `src/`; don't add the first one —
  add a token instead.
- Cross-feature imports go through the barrel — import from `features/<name>` (its `index.ts`),
  never reach into another feature's `components/`/`hooks/`/`models/` by path. If something
  isn't exported from the barrel, it isn't meant to be used outside that feature.
- Components never import `supabase` directly — go through that feature's repository (see
  Architecture below), even for a one-off read.
- Don't add local `try/catch` + toast in mutation hooks — `queryClient.ts`'s single
  `MutationCache.onError` already handles every mutation failure app-wide; a local catch there
  would just suppress that.

## Don't

- Don't commit `.env*` — already gitignored; if you ever need to show its shape, show
  `.env.example`-style key names only, never real values.
- Don't change a table's shape by editing Supabase directly or assuming a column exists — add a
  new file under `supabase/migrations/` (the existing ones are the schema's source of truth, and
  several carry design-rationale comments worth reading before you touch the same table).
- Don't rotate/change `GEMINI_API_KEY` in only one place — it's read from `process.env` by both
  the Vercel edge functions and the Supabase edge function; update both or they drift.
- Don't assume only `Sidebar` or only `BottomNav` is mounted — both are always in the tree and
  hide themselves by breakpoint (`desktop:hidden`/`desktop:flex`); code that reaches for "the
  nav" needs to account for both existing at once.

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

**AI pipeline.** Before changing anything under `api/*` or `src/server/*`, read
`docs/ai-pipeline.md` — it covers why the call is split client → edge function → `src/server/*`
→ Gemini, the three endpoints (`analyze`/`compare`/`embed`), how `useApplyCarePassport` turns a
diagnosis into `care_tasks`, and how embeddings get cached instead of recomputed.

**Supabase as the whole backend.** `supabase/migrations/*.sql` is the source of truth for the
schema — read the most recent ones before changing any table shape; several contain design-notes
comments explaining *why* a column is modeled a particular way (e.g. `light_level` enum vs.
`has_grow_light` boolean kept separate, `care_tasks` vs. `plant_care_logs` serving schedule vs.
history). Row-level security scopes every per-user table by `user_id = auth.uid()`; `species` is
an intentionally unscoped shared read-only catalog. `supabase/functions/send-photo-reminders/`
is a Supabase Edge Function (Deno), not a Vercel one — it's the scheduled job that sends push
reminders, separate from the Vercel `api/*.ts` functions that serve the SPA.

**Push notifications.** Before changing `features/reminders/*`, `public/push-sw.js`, the PWA
block in `vite.config.ts`, or `supabase/functions/send-photo-reminders/`, read `docs/push.md` —
it covers the subscribe/receive/send split, the due/eligible logic the cron job uses, and how to
add a new reminder type.

**Responsive layout, not responsive CSS alone.** Tailwind v4 (`@tailwindcss/vite`, no
`tailwind.config.*` — config lives in `src/shared/ui/tokens.css`). Below `desktop:` breakpoint,
`BottomNav` is the primary nav and pages render as a single mobile column; at `desktop:` and
above, `Sidebar` becomes the nav and `App.tsx`'s `PlantsLayout` adds `desktop:pl-60` plus a
re-centered max-width wrapper — `Sidebar`/`BottomNav` each hide themselves at the breakpoint
rather than being conditionally rendered, so don't assume only one of them exists in the tree.
Routes are lazy-loaded (`lazy(() => import(...))`) per page specifically to keep the initial
bundle under ~650 kB.
