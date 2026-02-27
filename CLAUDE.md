# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **Backend:** AdonisJS v7 (TypeScript), Lucid ORM, PostgreSQL, Redis (sessions)
- **Frontend:** React 19 + Inertia.js v2 (server-driven SPA), Vite
- **Auth:** Session-based (`@adonisjs/auth`), CSRF via `@adonisjs/shield`
- **Validation:** Vine (`@vinejs/vine`)
- **Testing:** Japa (unit, functional, browser/Playwright)
- **Node:** ≥24.0.0 required

## Development Commands

```bash
# Start dev server with HMR
npm run dev          # node ace serve --hmr

# Database
node ace migration:run
node ace migration:rollback
node ace db:seed --files=database/seeders/admin_seeder.ts  # seed roles + admin

# Type check (both backend and inertia frontend)
npm run typecheck

# Lint / format
npm run lint
npm run format

# Tests
npm test                                      # all suites
node ace test --files tests/unit/**           # single file/pattern
node ace test --groups functional             # by suite

# Build for production
npm run build        # node ace build

# Local PostgreSQL + PgAdmin via Docker
docker-compose up -d
```

## Architecture

### Request Lifecycle (Inertia)

1. HTTP request hits a route in `start/routes.ts`
2. Middleware stack runs (`start/kernel.ts`): body parser → session → CSRF shield → auth init
3. Named middleware (`auth()` / `guest()` / `admin()`) guard access
4. Controller validates input with `request.validateUsing(validator)` (Vine)
5. Controller calls `inertia.render('page-name', props)` — renders the React page server-side
6. `InertiaMiddleware` (`app/middleware/inertia_middleware.ts`) injects shared props: `user`, `errors`, `flash`
7. React page receives props; forms POST back via Inertia (CSRF token automatic)

### Module Aliases

Defined in `package.json` (`imports`):

| Alias            | Path               |
| ---------------- | ------------------ |
| `#controllers/*` | `app/controllers/` |
| `#models/*`      | `app/models/`      |
| `#services/*`    | `app/services/`    |
| `#validators/*`  | `app/validators/`  |
| `#config/*`      | `config/`          |
| `#start/*`       | `start/`           |

### Key Directories

- `start/routes.ts` — All HTTP routes
- `start/kernel.ts` — Middleware registration
- `start/env.ts` — Environment variable validation/typing
- `app/controllers/` — Request handlers
- `app/middleware/` — HTTP middleware
- `app/models/` — Lucid ORM models
- `app/validators/` — Vine validation schemas
- `app/transformers/` — Shape model data for props/API
- `config/` — Framework configuration (auth, database, session, inertia, vite)
- `inertia/pages/` — React page components
- `inertia/layouts/` — Shared layout wrappers
- `database/migrations/` — Schema migrations
- `database/seeders/` — Database seeders (e.g. `admin_seeder.ts`)
- `database/schema.ts` — Auto-generated model type definitions (do not edit manually)

### Authentication & Roles Pattern

- Guard: session-based web auth configured in `config/auth.ts`
- User model uses `withAuthFinder` mixin → exposes `verifyCredentials()`
- Passwords hashed by AdonisJS hash service (bcrypt)
- Apply `middleware.auth()` to protect routes; `middleware.guest()` for login/signup routes
- Roles stored in a `roles` table; `User` `belongsTo` `Role` via `roleId` (nullable FK)
- `auth_middleware` and `silent_auth_middleware` always preload `role` on the authenticated user
- `middleware.admin()` gates admin-only routes; checks `user.isAdmin` (getter on User model)
- After login, `SessionController` redirects to `/admin/dashboard` or `/dashboard` based on role
- Seed roles + admin account: `node ace db:seed --files=database/seeders/admin_seeder.ts` (reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME` from env)

### Validation Pattern

Validators live in `app/validators/`. Use `request.validateUsing(validator)` in controllers. Vine supports database-level rules (e.g., unique email check).

### API Serialization

`providers/api_provider.ts` adds `ctx.serialize()` to controllers, wrapping responses as `{ data: ... }` and handling Lucid pagination metadata. Use this for JSON API responses instead of returning models directly.

### Frontend Notes

- Inertia pages live in `inertia/pages/`; the default layout wraps all pages via `inertia/app.tsx`
- Toast notifications use Sonner
- Type-safe client-side routing via Tuyau (`inertia/client.ts`)
- Shared props (user, errors, flash) are available in every page component via `usePage().props`
- **UI Components:** Always use [Ark UI](https://ark-ui.com) for building UI components. Ark UI provides unstyled, accessible primitives that serve as the base for all interactive components in this project.
- **Tables:** Always use [TanStack Table](https://tanstack.com/table/latest) for data tables.

## Environment Variables

Validated in `start/env.ts`. See `.env.example` for a full template.

| Variable                                | Description                                |
| --------------------------------------- | ------------------------------------------ |
| `PORT`, `HOST`, `APP_URL`               | Server binding                             |
| `APP_KEY`                               | Application encryption key                 |
| `NODE_ENV`                              | `development` / `production` / `test`      |
| `LOG_LEVEL`                             | Pino log level                             |
| `SESSION_DRIVER`                        | `cookie` / `memory` / `database` / `redis` |
| `REDIS_HOST`, `REDIS_PORT`              | Redis host/port                            |
| `REDIS_PASSWORD`                        | Redis password                             |
| `DB_HOST`, `DB_PORT`                    | PostgreSQL host/port                       |
| `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` | PostgreSQL credentials                     |
| `SMTP_HOST`, `SMTP_PORT`                | SMTP server host/port                      |
| `SMTP_USERNAME`, `SMTP_PASSWORD`        | SMTP credentials                           |
| `MAIL_FROM_ADDRESS`                     | Sender address for outgoing emails         |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`         | Admin seed credentials (optional)          |
| `ADMIN_FULL_NAME`                       | Admin display name (optional)              |
