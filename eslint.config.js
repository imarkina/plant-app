// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'supabase/functions', 'src/shared/supabase/database.types.ts']), {
  // App source: covered by tsconfig.app.json, so it gets full type-aware linting
  // (catches things like floating promises and unsafe `any` flow that plain
  // syntax-level rules can't see).
  files: ['src/**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommendedTypeChecked,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,

  ],
  languageOptions: {
    globals: globals.browser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
}, {
  // Everything else (Storybook config, Vercel edge function handlers, root
  // tool configs): not part of the app's tsconfig project, so only
  // syntax-level linting — no type info to request.
  files: ['**/*.{ts,tsx}'],
  ignores: ['src/**'],
  extends: [js.configs.recommended, tseslint.configs.recommended],
  languageOptions: {
    globals: globals.browser,
  },
}, prettier, ...storybook.configs["flat/recommended"]])
