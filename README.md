# Lumera

Lumera is a React Native pregnancy and cycle tracking app with a modular Express API and Postgres database.

## Stack

- Mobile: Expo React Native, TypeScript, Expo Router, NativeWind
- API: Node.js, Express, TypeScript, modular feature architecture
- Database: Postgres with Drizzle ORM
- Local infrastructure: Docker Compose

## Local Services

The local Docker stack runs:

- API: http://localhost:4000
- Postgres: localhost:5433

Postgres uses port `5433` locally because `5432` was already in use on this machine.

## Setup

```sh
pnpm install
docker compose up -d postgres
pnpm db:migrate
docker compose up --build -d api
```

## Mobile

```sh
pnpm dev:mobile
```

To open iOS directly:

```sh
pnpm --filter @lumera/mobile ios
```

## API

```sh
pnpm dev:api
```

Health check:

```sh
curl http://localhost:4000/health
```

## Verification

```sh
pnpm -r typecheck
pnpm --filter @lumera/api test
pnpm -r build
pnpm --filter @lumera/mobile exec expo export --platform ios --output-dir /tmp/lumera-ios-export
```

## Environment

Copy `.env.example` to `.env` when you want local overrides. When you provide the Neon connection string, set `DATABASE_URL` to that value and run:

```sh
pnpm db:migrate
```
