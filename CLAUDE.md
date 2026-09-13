# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (also regenerates `AGENTS.md`, see above)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npm run test` — run the full Vitest suite once
- `npm run test:watch` — Vitest in watch mode
- `npx vitest run path/to/file.test.ts` — run a single test file
- `npx vitest run -t "test name"` — run tests matching a name
- `npx tsc --noEmit` — type-check without emitting (not wired into a script)

## Stack

- Next.js **16.3.5** (App Router) with React **19.2.8** — a version ahead of most training data; per `AGENTS.md`, check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs (e.g. `app/layout.tsx` uses the typed-route prop pattern `LayoutProps<"/">` instead of a hand-written children prop type).
- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config`; configured entirely in `app/globals.css`, including the `@tailwindcss/typography` plugin used for markdown rendering).
- shadcn/ui, but on the newer `base-nova` style backed by **`@base-ui/react`**, not Radix — component internals (`components/ui/*`) look different from the Radix-based shadcn code most training data reflects. `cn()` comes from the `cn` package, not a hand-rolled `clsx`+`tailwind-merge` util.
- TypeScript strict mode, `any` banned by convention, path alias `@/*` → project root.
- Vitest + React Testing Library, config in `vitest.config.mts` (jsdom environment, `@/*` alias, globals on) and `vitest.setup.ts` (jest-dom matchers). Tests are co-located as `*.test.ts(x)` next to the source file, not in a separate `__tests__` tree.

## Architecture

This is a single-page app (one route, `/`) that turns user-submitted text into an AI-generated "writing style" report:

`app/page.tsx` (client component, holds all UI state) → `AnalyzerForm` submits to `POST /api/analyze` → `app/api/analyze/route.ts` validates the request and calls `analyzeWritingStyle()` in `lib/gemini.ts` → Gemini API → markdown string returned to the client → rendered by `ResultView` via `react-markdown`/`remark-gfm` and pushed into history via `useAnalysisHistory`.

Key things a future change needs to respect:

- **`lib/gemini.ts` is server-only** (`import "server-only"`) and must never be imported from a client component — it reads the API key from `process.env`. The env var is intentionally named `GEMINT_API_KEY` (typo, matches what's actually in `.env.local`), with `GEMINI_API_KEY` as a fallback. Never prefix a Gemini-related env var with `NEXT_PUBLIC_`.
- **The model name is pinned in `lib/constants.ts` (`GEMINI_MODEL`)**, currently `gemini-3.5-flash-lite`. It was picked by live-checking `ai.google.dev/gemini-api/docs/models` and `/pricing` for the fastest model still on the free tier — re-verify against those pages (not training-data knowledge, which is likely stale) before changing it.
- **History persistence (`lib/storage.ts` + `hooks/use-analysis-history.ts`) uses `useSyncExternalStore`**, not `useState`+`useEffect`. This is deliberate: a naive effect-based load from `localStorage` both trips the `react-hooks/set-state-in-effect` ESLint rule and risks an SSR/hydration mismatch. `getServerSnapshot` and the empty-state snapshot must stay referentially stable (a fresh `[]` literal on every call breaks React with an infinite-loop warning).
- **No database, no external API besides Gemini** — history lives entirely in `localStorage` (key `writing-style-analyzer:history`, capped at 5 items, oldest evicted first).
- **Light mode only** — there's no dark-mode UI in this app; don't add a `.dark` class or wire up `prefers-color-scheme`.
- **8-color theme system** (`THEME_COLORS` in `lib/constants.ts`) is cycled per history item (`getThemeColor(history.length)`) purely for visual variety, and looked back up by value via `findThemeColor()` when rendering a past result.
- `/api/analyze` validates in order: JSON parse → `Content-Length` size guard (413, before the body is even read) → text type/emptiness (400) → max length 2000 chars (400) → Gemini call (502 on failure). Client-side (`AnalyzerForm`) mirrors the same 2000-char limit so the submit button disables and an inline error shows before a request is ever sent.
- Resetting to the initial state (clearing input/result/error but keeping history) is wired through `handleReset` in `app/page.tsx`, invoked from both the header logo/title and the "新しく分析する" button in `ResultView` — there's no other route to navigate "home" to.
