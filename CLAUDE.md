# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (also regenerates AGENTS.md, see above)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)

There is no test runner configured in `package.json` yet.

## Stack and architecture

- Next.js **16.3.5** (App Router) with React **19.2.8** — a version ahead of most training data; per `AGENTS.md`, check `node_modules/next/dist/docs/` before relying on remembered Next.js APIs. For example, `app/layout.tsx` already uses the newer typed-route prop pattern `LayoutProps<"/">` rather than a hand-written `{ children: React.ReactNode }` prop type.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config`; v4 is configured through `app/globals.css`).
- TypeScript strict mode, path alias `@/*` → project root (`tsconfig.json`).
- Single route group so far: `app/layout.tsx` (root layout, Geist fonts) and `app/page.tsx`.

## Current state

The project is presently an unmodified `create-next-app` scaffold (default landing page/layout) under the name `writing_style_analyzer` — no writing-style-analysis functionality has been implemented yet.
