# my portfolio project

A one-page, terminal-flavoured portfolio site with a small backoffice
CMS. Built with **Next.js** (App Router) + **Bun**, **Tailwind**, **Drizzle ORM**
over **Postgres**, and packaged for **Kubernetes**.

## configuration

- **Personal, non-secret values** go in [`site.config.ts`](./site.config.ts):
  name, intro, social handles, location/timezone, GitHub username, admin path.
- **Secrets / environment** are listed in [`.env.example`](./.env.example):
  `DATABASE_URL`, `GITHUB_TOKEN`, `SESSION_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD`.
    - admin credentials are only for local seeding and can be omitted on production(if no seed script is going to be used)

## local development

```bash
bun install
cp .env.example .env.local            # then edit values

docker compose up -d                  # local Postgres on :5432
bun run db:migrate                    # apply schema
bun run db:seed                       # create admin user + sample projects

bun run dev                           # http://localhost:3000
```

### database scripts
```bash
bun run db:generate  # Generate a migration from the schema
bun run db:migrate`  # Apply pending migrations
bun run db:push`     # Push schema directly (dev only)
bun run db:seed`     # Seed admin user + sample projects
bun run db:studio`   # Open Drizzle Studio
```

## production / k8s
TBD

<!-- 

The image is self-contained (Next standalone output) and configured entirely via
environment variables.

```bash
docker build -t portfolio:latest .
docker run -p 3000:3000 --env-file .env.local portfolio:latest
```

Deployment notes:

- Supply env via a `Secret` (`DATABASE_URL`, `GITHUB_TOKEN`, `SESSION_SECRET`,
  `ADMIN_*`) and mount as environment variables.
- **Probes**: point liveness/readiness at `GET /api/health` (returns 200).
- **Migrations**: run `bunx drizzle-kit migrate` as a pre-deploy CI step or a
  one-shot `Job`/`initContainer` built from the `build` stage of the Dockerfile
  (the lean runtime image intentionally omits `drizzle-kit`). The runtime image
  never migrates on its own.
- The app is `force-dynamic`: CMS edits appear immediately, and no database is
  required at build time.
-->
