import { getTimelinePage, PAGE_SIZE } from "@/lib/projects";
import { Section } from "@/components/ui";
import { TimelineClient } from "./TimelineClient";

/** Server-renders the first page of projects, then hands off to the client for paging. */
export async function Timeline() {
  let initial;
  try {
    initial = await getTimelinePage(0, PAGE_SIZE);
  } catch {
    initial = { items: [], hasMore: false, total: 0 };
  }

  return (
    <Section label="~/projects" id="projects">
      <h2 className="mb-12 text-2xl font-bold sm:text-3xl">project timeline</h2>
      <TimelineClient initial={initial} pageSize={PAGE_SIZE} />
    </Section>
  );
}
