# Finzen

Personal finance app built with React 19, TanStack Start, shadcn/ui (Base UI), Dexie, and Paraglide.

## Requirements

- Node.js 22+
- pnpm
- A Google Cloud OAuth client (only for Google Drive backup)

## Setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

The app runs at `http://localhost:3000`.

## Environment variables

| Variable | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public app URL, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |

Enable the Google Drive API and add `https://www.googleapis.com/auth/drive.appdata` as an allowed scope for the OAuth client.

## Scripts

```bash
pnpm dev              # Start the dev server
pnpm build            # Production build
pnpm typecheck        # TypeScript checks
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm check:i18n       # Validate translations
pnpm compile:i18n     # Compile Paraglide messages
pnpm generate-routes  # Regenerate TanStack Router route tree
```

## Architecture

- `src/routes` — TanStack Start file routes.
- `src/features` — Domain UI components and page data helpers.
- `src/services` — One public function per file for data mutations, queries, backups, and Google Drive access.
- `src/lib/dexie` — IndexedDB schema and seed data.
- `src/types` — Valibot schemas and inferred TypeScript types.
- `messages` — Flat Paraglide message keys; only `errors` is nested.

## Local data

The Dexie database is versioned. Version 2 resets local data and seeds the default categories and app state; no migration from earlier development data is performed. Cloud and local backups can be restored from the welcome or settings screens.
