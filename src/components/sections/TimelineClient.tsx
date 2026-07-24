"use client";

import { useState } from "react";
import type { TimelineProject, TimelinePage } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Button, FadeIn } from "@/components/ui";
import { clsx } from "@/lib/utils";

interface TimelineClientProps {
  initial: TimelinePage;
  pageSize: number;
}

/** Projects shown before any expansion. */
const INITIAL_VISIBLE = 3;
/** Additional projects revealed per "load more" click. */
const VISIBLE_STEP = 5;

/** Central-axis timeline that reveals projects in chunks, fetching from `/api/projects` as needed. */
export function TimelineClient({ initial, pageSize }: TimelineClientProps) {
  const [items, setItems] = useState<TimelineProject[]>(initial.items);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleItems = items.slice(0, visible);
  const canReveal = visible < items.length || hasMore;

  async function loadMore() {
    const next = visible + VISIBLE_STEP;

    if (next > items.length && hasMore) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/projects?offset=${items.length}&limit=${pageSize}`,
        );
        if (!res.ok) throw new Error(`request failed: ${res.status}`);
        const page: TimelinePage = await res.json();
        setItems((prev) => [...prev, ...page.items]);
        setHasMore(page.hasMore);
      } catch {
        setError("Couldn't load more projects. Try again.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setVisible(next);
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-ink-muted">No projects yet — check back soon.</p>
    );
  }

  const fadeMask = "linear-gradient(to bottom, #000 calc(100% - 16rem), transparent 100%)";

  return (
    <div className="relative">
      <div
        className="relative"
        style={
          canReveal
            ? { maskImage: fadeMask, WebkitMaskImage: fadeMask }
            : undefined
        }
      >
        <div
          aria-hidden
          className="absolute bottom-0 left-4 top-0 w-px bg-ink-muted/40 lg:left-1/2 lg:-translate-x-1/2"
        />

        <ol className="space-y-10">
        {visibleItems.map((project, i) => {
          const year = project.startDate.slice(0, 4);
          const showYear =
            i === 0 || visibleItems[i - 1].startDate.slice(0, 4) !== year;
          const isPro = project.type === "professional";

          return (
            <li key={project.id}>
              {showYear ? (
                <div className="relative mb-8 flex items-center lg:justify-center">
                  <span className="ml-4 bg-paper px-2 text-sm font-bold tabular-nums text-ink lg:ml-0">
                    {year}
                  </span>
                </div>
              ) : null}

              <div className="relative lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8">
                <span
                  aria-hidden
                  className="absolute left-4 top-6 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-ink bg-paper lg:left-1/2"
                />

                {isPro ? (
                  <>
                    <FadeIn as="div" className="ml-10 lg:ml-0" delay={(i % pageSize) * 40}>
                      <ProjectCard project={project} />
                    </FadeIn>
                    <span className="hidden lg:block" aria-hidden />
                    <span className="hidden lg:block" aria-hidden />
                  </>
                ) : (
                  <>
                    <span className="hidden lg:block" aria-hidden />
                    <span className="hidden lg:block" aria-hidden />
                    <FadeIn as="div" className="ml-10 lg:ml-0" delay={(i % pageSize) * 40}>
                      <ProjectCard project={project} />
                    </FadeIn>
                  </>
                )}
              </div>
            </li>
          );
        })}
        </ol>
      </div>

      <div className={clsx("mt-12 flex flex-col items-center gap-3", "lg:ml-0")}>
        {error ? <p className="text-sm text-ink-muted">{error}</p> : null}
        {canReveal ? (
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loading}
            className="relative z-10 bg-paper"
          >
            {loading ? "loading…" : "load more"}
          </Button>
        ) : (
          <p className="relative z-10 mt-2 bg-paper px-3 py-1 text-xs text-ink-faint">
            — end of timeline —
          </p>
        )}
      </div>
    </div>
  );
}
