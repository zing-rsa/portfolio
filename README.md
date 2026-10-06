# my portfolio site

A one page scrollable portfolio site with some information about my projects, a link to my lab demo, and a small backoffice
CMS. Built with next and bun, tailwind, drizzle ORM over Postgres, and packaged for K8s.

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
