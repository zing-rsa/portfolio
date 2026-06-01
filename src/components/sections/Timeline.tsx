import { getTimelinePage, PAGE_SIZE } from "@/lib/projects";
import { Section } from "@/components/ui";
import { TimelineClient } from "./TimelineClient";

/**
 * Server component: fetches the first page of projects directly from the DB so
 * the initial 10 are server-rendered, then hands off to the client component
 * for "Load more" paging.
 */
export async function Timeline() {
  let initial;
  try {
    initial = await getTimelinePage(0, PAGE_SIZE);
  } catch {
    // DB unreachable — render an empty timeline rather than crashing the page.
    initial = { items: [], hasMore: false, total: 0 };
  }

  return (
    <Section label="~/projects" id="projects">
      <h2 className="mb-12 text-2xl font-bold sm:text-3xl">project timeline</h2>
      <TimelineClient initial={initial} pageSize={PAGE_SIZE} />
    </Section>
  );
}
