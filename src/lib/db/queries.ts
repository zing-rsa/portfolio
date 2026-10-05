import { desc, eq, sql } from "drizzle-orm";
import { db } from "./index";
import { projects, siteCounters, type NewProject, type Project } from "./schema";
import { log } from "@/lib/log";

/** Key for the "leave some love" global tally in `site_counters`. */
export const LOVE_COUNTER_KEY = "love";

export interface ProjectPage {
  items: Project[];
  /** Whether more rows exist beyond this page. */
  hasMore: boolean;
  total: number;
}

/** Times a query block and emits a debug line (op + duration). No-op cost at info level. */
async function timed<T>(
  op: string,
  fn: () => Promise<T>,
  meta?: Record<string, unknown>,
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    log.debug("db query", {
      op,
      duration_ms: Math.round(performance.now() - start),
      ...meta,
    });
  }
}

/**
 * Projects newest-first by start date (professional and personal interleaved),
 * paged for the timeline's "Load more". Fetches `limit + 1` rows to determine
 * `hasMore` without a second count query per page.
 */
export async function getProjectsPage(
  offset = 0,
  limit = 10,
): Promise<ProjectPage> {
  return timed(
    "getProjectsPage",
    async () => {
      const rows = await db
        .select()
        .from(projects)
        .orderBy(desc(projects.startDate), desc(projects.createdAt))
        .limit(limit + 1)
        .offset(offset);

      const hasMore = rows.length > limit;
      const items = hasMore ? rows.slice(0, limit) : rows;

      const total = await db.$count(projects);

      return { items, hasMore, total };
    },
    { offset, limit },
  );
}

/** All projects, newest-first — used by the admin dashboard. */
export async function getAllProjects(): Promise<Project[]> {
  return timed("getAllProjects", () =>
    db
      .select()
      .from(projects)
      .orderBy(desc(projects.startDate), desc(projects.createdAt)),
  );
}

export async function getProjectById(id: string): Promise<Project | null> {
  return timed(
    "getProjectById",
    async () => {
      const [row] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, id))
        .limit(1);
      return row ?? null;
    },
    { id },
  );
}

export async function createProject(data: NewProject): Promise<Project> {
  return timed("createProject", async () => {
    const [row] = await db.insert(projects).values(data).returning();
    return row;
  });
}

export async function updateProject(
  id: string,
  data: Partial<NewProject>,
): Promise<Project | null> {
  return timed(
    "updateProject",
    async () => {
      const [row] = await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      return row ?? null;
    },
    { id },
  );
}

export async function deleteProject(id: string): Promise<boolean> {
  return timed(
    "deleteProject",
    async () => {
      const rows = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning({ id: projects.id });
      return rows.length > 0;
    },
    { id },
  );
}

/** Current value of a named counter; 0 if the row doesn't exist yet. */
export async function getCounter(key: string): Promise<number> {
  return timed(
    "getCounter",
    async () => {
      const [row] = await db
        .select({ count: siteCounters.count })
        .from(siteCounters)
        .where(eq(siteCounters.key, key))
        .limit(1);
      return row?.count ?? 0;
    },
    { key },
  );
}

/**
 * Atomically increment a named counter and return the new value. Upserts the
 * row on first use so no seeding is required.
 */
export async function incrementCounter(key: string): Promise<number> {
  return timed(
    "incrementCounter",
    async () => {
      const [row] = await db
        .insert(siteCounters)
        .values({ key, count: 1 })
        .onConflictDoUpdate({
          target: siteCounters.key,
          set: { count: sql`${siteCounters.count} + 1`, updatedAt: new Date() },
        })
        .returning({ count: siteCounters.count });
      return row.count;
    },
    { key },
  );
}
