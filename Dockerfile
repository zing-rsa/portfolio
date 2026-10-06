# syntax=docker/dockerfile:1

# ---- deps: install with bun (lockfile-faithful) ----
FROM oven/bun:1.3.10 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- build: compile Next.js with Node, emit standalone output ----
# Next 16 builds with Turbopack, whose compiled prod runtime can't be loaded by
# Bun's module loader — so `next build` must run under Node. We build on the
# Node image and copy in the Bun binary purely to bundle the migrator below.
FROM node:24-slim AS build
WORKDIR /app
COPY --from=oven/bun:1.3.10 /usr/local/bin/bun /usr/local/bin/bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL is not needed at build time (the app is force-dynamic), but
# Next reads NEXT_PUBLIC_* envs here if any are added later.
ENV NEXT_TELEMETRY_DISABLED=1
RUN node ./node_modules/.bin/next build

# Bundle a standalone DB migrator (drizzle-orm + postgres inlined into one file)
# so the slim runtime can run migrations without drizzle-kit or dev node_modules.
RUN bun build ./src/lib/db/migrate.ts --target node --outfile migrate.mjs

# ---- runtime: distroless image running the standalone server ----
# Distroless ships only glibc + node — no apt, shell, npm or perl — so the
# recurring Debian userland CVEs (perl-base, libpcre2, ...) simply aren't
# present, and the image is far smaller than node:*-slim.
FROM gcr.io/distroless/nodejs24-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as the non-root user shipped with distroless (uid 65532).
USER nonroot

# Standalone trace output + static assets + public dir.
COPY --from=build --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=build --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=build --chown=nonroot:nonroot /app/public ./public

# DB migrator bundle + SQL files, run by the migrate initContainer before the app starts.
COPY --from=build --chown=nonroot:nonroot /app/migrate.mjs ./migrate.mjs
COPY --from=build --chown=nonroot:nonroot /app/drizzle ./drizzle

EXPOSE 3000
# The distroless nodejs image sets ENTRYPOINT ["/nodejs/bin/node"], so CMD is
# just the script to run.
CMD ["server.js"]