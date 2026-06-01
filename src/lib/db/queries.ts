import { desc, eq } from "drizzle-orm";
import { db } from "./index";
import { projects, type NewProject, type Project } from "./schema";

export interface ProjectPage {
  items: Project[];
  /** Whether more rows exist beyond this page. */
  hasMore: boolean;
  total: number;
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
}

/** All projects, newest-first — used by the admin dashboard. */
export async function getAllProjects(): Promise<Project[]> {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.startDate), desc(projects.createdAt));
}

export async function getProjectById(id: string): Promise<Project | null> {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);
  return row ?? null;
}

export async function createProject(data: NewProject): Promise<Project> {
  const [row] = await db.insert(projects).values(data).returning();
  return row;
}

export async function updateProject(
  id: string,
  data: Partial<NewProject>,
): Promise<Project | null> {
  const [row] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return row ?? null;
}

export async function deleteProject(id: string): Promise<boolean> {
  const rows = await db
    .delete(projects)
    .where(eq(projects.id, id))
    .returning({ id: projects.id });
  return rows.length > 0;
}
