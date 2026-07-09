# syntax=docker/dockerfile:1

# ---- deps: install with bun (lockfile-faithful) ----
FROM oven/bun:1.3.10 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- build: compile Next.js with bun, emit standalone output ----
FROM oven/bun:1.3.10 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL is not needed at build time (the app is force-dynamic), but
# Next reads NEXT_PUBLIC_* envs here if any are added later.
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# Bundle a standalone DB migrator (drizzle-orm + postgres inlined into one file)
# so the slim runtime can run migrations without drizzle-kit or dev node_modules.
RUN bun build ./src/lib/db/migrate.ts --target node --outfile migrate.mjs

# ---- runtime: minimal node image running the standalone server ----
FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# The standalone server runs with `node` only — npm/npx/corepack are never
# invoked at runtime and only add CVEs via their bundled deps (sigstore,
# picomatch, ...). Strip them to shrink the attack surface and image size.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx \
    /usr/local/lib/node_modules/corepack /usr/local/bin/corepack

# Run as the non-root user shipped with the node image.
RUN chown node:node /app
USER node

# Standalone trace output + static assets + public dir.
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

# DB migrator bundle + SQL files, run by the migrate initContainer before the app starts.
COPY --from=build --chown=node:node /app/migrate.mjs ./migrate.mjs
COPY --from=build --chown=node:node /app/drizzle ./drizzle

EXPOSE 3000
CMD ["node", "server.js"]
