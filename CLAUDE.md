# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Next.js version warning (from AGENTS.md):** This project uses Next.js 16.2.6, which may have breaking changes from training data. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

## Commands

All commands run from the `taskroulette/` directory.

```bash
npm run dev        # start dev server at localhost:3000
npm run build      # production build
npm run lint       # eslint check
npm run db:push    # push Drizzle schema to NeonDB
npm run db:studio  # open Drizzle Studio GUI
```

## Environment Variables

Required in `.env.local`:
- `DATABASE_URL` — NeonDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` — Clerk auth

## Architecture

**Stack:** Next.js App Router, React 19, TypeScript, Clerk (auth), Drizzle ORM + NeonDB (PostgreSQL serverless), custom CSS (no Tailwind).

### Data Flow Pattern

Pages follow a strict split: Server Component fetches data → passes to `*Client.tsx` for interactivity.

```
app/dashboard/roulette/page.tsx       ← Server Component: queries DB, builds TaskWithCategory[]
app/dashboard/roulette/RouletteClient.tsx  ← Client Component: all state, UI, optimistic updates
```

Client components apply optimistic state updates immediately, then call Server Actions from `lib/actions/tasks.ts` which write to DB and call `revalidatePath('/dashboard', 'layout')`.

### Authentication & User Provisioning

- Clerk handles auth. `middleware.ts` protects all routes except `/sign-in` and `/sign-up`.
- `lib/ensure-user.ts` — called in `app/dashboard/layout.tsx` on every dashboard request. If the Clerk user has no DB row yet, it inserts into `users` and calls `seedDefaultCategories()`. This is the only place new users are provisioned.
- Server Actions in `lib/actions/tasks.ts` call `auth()` directly and throw if unauthenticated — they do not call `ensureUser`.

### Database Schema (`lib/db/schema.ts`)

Three tables: `users` (Clerk ID as PK), `categories` (per-user, has `color` and `icon`), `tasks` (per-user, optional FK to category).

Enums: `priority` → `HIGH | MEDIUM | LOW`, `difficulty` → `EASY | MEDIUM | HARD`.

Key type: `TaskWithCategory = Task & { category: Category | null }` — assembled in page Server Components by joining tasks with a category map.

### Key Directories

- `lib/actions/` — all Server Actions (currently only `tasks.ts`)
- `lib/db/` — Drizzle client (`index.ts`) and schema
- `components/ui/` — atomic UI components (Button, Badge, Chip, Modal, Toast, etc.)
- `components/tasks/` — task-specific components (TaskRow, TaskModal, ConfirmDialog)
- `components/layout/` — SidebarNav, MainContainer
- `components/providers/` — ToastProvider (wraps dashboard layout)
- `hooks/` — `useToast` (consumes ToastProvider context)
- `styles/globals.css` — entire design system as custom CSS variables and utility classes; no CSS modules or Tailwind
- `lib/constants.ts` — canonical labels and types for Priority and Difficulty
