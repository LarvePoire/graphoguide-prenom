# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- AdonisJS v7 (TypeScript), Lucid ORM, PostgreSQL, Redis (sessions), Node ≥24
- React 19 + Inertia.js v2, Vite, SCSS
- Auth: session-based (`@adonisjs/auth`), CSRF via `@adonisjs/shield`
- Validation: Vine (`@vinejs/vine`)
- Testing: Japa (unit, functional, browser/Playwright)

## Commands

```bash
npm run dev          # dev server with HMR
npm run build
npm run typecheck    # backend + inertia
npm run lint && npm run format
npm test
node ace test --files tests/unit/**      # single pattern
node ace test --groups functional
node ace migration:run
node ace db:seed --files=database/seeders/admin_seeder.ts
docker-compose up -d  # PostgreSQL + PgAdmin
```

## Conventions

**Module aliases** (defined in `package.json` `imports`): `#controllers/*`, `#models/*`, `#services/*`, `#validators/*`, `#config/*`, `#start/*`

**Routes/middleware:** `start/routes.ts`, `start/kernel.ts`. Named middleware: `auth()` / `guest()` / `admin()`.

**Shared props:** `InertiaMiddleware` (`app/middleware/inertia_middleware.ts`) injects `user`, `errors`, `flash` into every page via `usePage().props`.

**Flash toasts:** `inertia/lib/toaster.ts` singleton (Ark UI `createToaster`). Layout (`inertia/layouts/default.tsx`) watches `flash` object reference (changes on every Inertia navigation — Inertia deep-clones props). Always wrap `toaster.create()` in `queueMicrotask()` when called from `useEffect`.

**Auth/Roles:** `withAuthFinder` mixin on User → `verifyCredentials()`. `auth_middleware` + `silent_auth_middleware` always preload `role`. `user.isAdmin` getter gates admin routes. `E_INVALID_CREDENTIALS` has a built-in `handle()` that flashes to `errorsBag` — do not catch it manually.

**Validation:** validators in `app/validators/`, use `request.validateUsing(validator)` in controllers.

**API serialization:** `providers/api_provider.ts` → `ctx.serialize()` wraps JSON responses as `{ data: ... }`.

**UI:** Always use [Ark UI](https://ark-ui.com) for interactive components. Ark UI styled via `[data-scope='x'][data-part='y']` selectors (not class names). Always use [TanStack Table](https://tanstack.com/table/latest) for data tables.

**SCSS:** Entry point `inertia/css/app.scss` with `@use` imports. Structure: `abstracts/` (variables), `base/` (reset, typography), `components/` (button, alerts, ark-ui, toast), `pages/` (layout, home, auth). Variables exported via `@use '../abstracts/variables' as *`.

**`database/schema.ts`** — auto-generated, do not edit manually.

## Environment

All vars validated in `start/env.ts`. See `.env.example`. Admin seed reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME` from env.
