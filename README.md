# portfolio

A one-page, black-and-white, terminal-flavoured portfolio site with a backoffice
CMS. Built with **Next.js** (App Router) + **Bun**, **Tailwind**, **Drizzle ORM**
over **Postgres**, and packaged for **Kubernetes**.

## Stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js (App Router, TypeScript), `output: 'standalone'`      |
| Package manager| Bun                                                           |
| Styling        | Tailwind CSS — strict monochrome terminal theme               |
| Data layer     | Drizzle ORM + `postgres` driver                               |
| Auth           | Custom signed-cookie session (`jose` + `bcryptjs`), single admin |
| GitHub stats   | Live GitHub GraphQL API, cached server-side (1h)              |
| Icons          | `simple-icons`, resolved to SVG paths server-side             |

## Sections

- **Hero** — typewriter heading, intro, social/contact links, live local time.
- **GitHub stats** — contribution calendar, stars, followers, pinned & starred
  repos, most-used languages.
- **Project timeline** — professional (left) and personal (right) projects on a
  central axis, newest first, paged with "Load more" (10 at a time).
- **Footer** — get-in-touch invitation.
- **/admin** — login + project CRUD.

The only animations are a typed hero heading and subtle scroll fade-in/out, both
disabled under `prefers-reduced-motion`.

## Configuration

- **Personal, non-secret values** live in [`site.config.ts`](./site.config.ts):
  name, intro, social handles, location/timezone, GitHub username, admin path.
- **Secrets / environment** are listed in [`.env.example`](./.env.example):
  `DATABASE_URL`, `GITHUB_TOKEN`, `SESSION_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD`.

## Local development

```bash
bun install
cp .env.example .env.local            # then edit values

docker compose up -d                  # local Postgres on :5432
bun run db:migrate                    # apply schema
bun run db:seed                       # create admin + sample projects

bun run dev                           # http://localhost:3000
```

Sign in to the CMS at `http://localhost:3000/admin` with the seeded
`ADMIN_EMAIL` / `ADMIN_PASSWORD`.

### Database scripts

| Script              | Purpose                              |
| ------------------- | ------------------------------------ |
| `bun run db:generate` | Generate a migration from the schema |
| `bun run db:migrate`  | Apply pending migrations             |
| `bun run db:push`     | Push schema directly (dev only)      |
| `bun run db:seed`     | Seed admin user + sample projects    |
| `bun run db:studio`   | Open Drizzle Studio                  |

## Production / Kubernetes

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
