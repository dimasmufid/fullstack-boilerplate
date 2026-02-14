# Fullstack Boilerplate

Monorepo boilerplate built with Turborepo, containing:

- `apps/web`: Next.js 16 frontend (React 19, Tailwind CSS v4, shadcn/ui)
- `apps/api`: NestJS 11 backend (Better Auth + Drizzle ORM + Swagger)

## Tech Stack

- [Turborepo](https://turbo.build/repo)
- [pnpm](https://pnpm.io/)
- [Next.js](https://nextjs.org/)
- [NestJS](https://nestjs.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeScript](https://www.typescriptlang.org/)

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL (local or hosted)

## Quick Start

1. Install dependencies:

```bash
pnpm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Update `.env` values:

- `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:4000`)
- `API_URL` (e.g. `http://localhost:4000`)
- `DATABASE_URL`
- `BETTER_AUTH_SECRET` (generate with `openssl rand -hex 32`)
- `BETTER_AUTH_URL` (API origin, e.g. `http://localhost:4000`)
- `CORS_ORIGIN` (e.g. `http://localhost:3000`)
- `BETTER_AUTH_COOKIE_DOMAIN` (optional, for cross-subdomain prod setup)

4. Run migrations:

```bash
pnpm db:migrate
```

5. Start both apps:

```bash
pnpm dev
```

## Local Endpoints

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Auth base path: `http://localhost:4000/api/v1/auth`
- Swagger docs: `http://localhost:4000/docs`

## Scripts

Run from repository root:

- `pnpm dev` - Start all apps in dev mode
- `pnpm dev:web` - Start only web app
- `pnpm dev:api` - Start only API app
- `pnpm build` - Build all apps
- `pnpm start` - Start all built apps
- `pnpm lint` - Run lint tasks across apps
- `pnpm db:generate` - Generate Drizzle migration files
- `pnpm db:migrate` - Apply Drizzle migrations
- `pnpm db:push` - Push schema directly to database

API tests:

- `pnpm --filter api test`
- `pnpm --filter api test:e2e`
- `pnpm --filter api test:cov`

## Project Structure

```text
.
├── apps/
│   ├── web/
│   │   ├── src/app
│   │   ├── src/components
│   │   ├── src/lib
│   │   ├── src/hooks
│   │   └── public/
│   └── api/
│       ├── src/
│       └── test/
├── drizzle/                # shared migration files
├── drizzle.config.ts
├── turbo.json
└── pnpm-workspace.yaml
```

## Docker

- Local PostgreSQL only:

```bash
docker compose up -d
```

- Production compose setup:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

`docker-compose.prod.yml` expects an external Docker network named `dokploy-network`.

## Notes

- Both `apps/web` and `apps/api` load environment variables from the root `.env`.
- API default port is `4000`; web default port is `3000`.

## License

[MIT](LICENSE)
