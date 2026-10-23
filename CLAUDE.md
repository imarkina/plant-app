# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This is a fresh `npm create vite -- --template react-ts` scaffold. `src/App.tsx` is still the
default counter demo (with the Vite/React logos swapped for `src/assets/hero.png`); no
application-specific features, backend, or state management have been added yet. There is no
test setup.

## Commands

- `npm run dev` — start the Vite dev server with HMR.
- `npm run build` — type-check via `tsc -b` (project references: `tsconfig.app.json` +
  `tsconfig.node.json`) and then build with Vite. Both steps must pass; a type error fails the
  build even if Vite itself would otherwise succeed.
- `npm run lint` — ESLint over the whole repo (flat config in `eslint.config.js`).
- `npm run preview` — serve the production build from `dist/` locally.

There is no test runner configured yet.

## Architecture notes

- TypeScript project is split into two tsconfigs referenced from the root `tsconfig.json`:
  `tsconfig.app.json` for application/browser code under `src/`, and `tsconfig.node.json` for
  Vite config/tooling code (e.g. `vite.config.ts`). Keep that split in mind when adding config
  files — Node-only tooling scripts belong under the node tsconfig's scope, not the app one.
- ESLint config only enables `tseslint.configs.recommended` (not the type-checked variants) plus
  `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh` (Vite-specific fast-refresh
  rules). If type-aware lint rules are needed later, see the upgrade snippet in `README.md`.
- Static SVG icons referenced via `<use href="/icons.svg#...">` live in `public/icons.svg` and
  are served as-is (not bundled), so new icons must be added to that sprite file directly rather
  than imported as modules.
