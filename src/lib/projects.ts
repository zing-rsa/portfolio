/**
 * Server-side mapping between DB `Project` rows and the render-ready
 * `TimelineProject` shape sent to the client. Resolves all icon slugs to SVG
 * path strings here so the client never imports simple-icons.
 */
import type { Project } from "@/lib/db/schema";
import { getProjectsPage } from "@/lib/db/queries";
import { resolveTechIcons, getIconPath, type TechIcon } from "@/lib/icons";

export const PAGE_SIZE = 10;

export interface TimelineProject {
  id: string;
  type: "professional" | "personal";
  title: string;
  description: string;
  startDate: string;
  endDate: string | null;
  technologies: TechIcon[];
  // professional
  organization: string | null;
  organizationIconPath: string | null;
  role: string | null;
  // personal
  imageUrl: string | null;
  link: string | null;
  githubLink: string | null;
}

export function serializeProject(p: Project): TimelineProject {
  return {
    id: p.id,
    type: p.type,
    title: p.title,
    description: p.description,
    startDate: p.startDate,
    endDate: p.endDate,
    technologies: resolveTechIcons(p.technologies),
    organization: p.organization,
    organizationIconPath: getIconPath(p.organizationIcon),
    role: p.role,
    imageUrl: p.imageUrl,
    link: p.link,
    githubLink: p.githubLink,
  };
}

export interface TimelinePage {
  items: TimelineProject[];
  hasMore: boolean;
  total: number;
}

export async function getTimelinePage(
  offset = 0,
  limit = PAGE_SIZE,
): Promise<TimelinePage> {
  const page = await getProjectsPage(offset, limit);
  return {
    items: page.items.map(serializeProject),
    hasMore: page.hasMore,
    total: page.total,
  };
}
