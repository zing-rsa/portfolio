"use client";

import { useState } from "react";
import type { TimelineProject, TimelinePage } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Button, FadeIn } from "@/components/ui";
import { clsx } from "@/lib/utils";
import { computeLayout, GUTTER } from "./timelineLayout";
import { useTimelineMeasure } from "./useTimelineMeasure";

interface TimelineClientProps {
  initial: TimelinePage;
  /** Projects shown initially and revealed per "load more" (also the fetch page size). */
  pageSize: number;
}

/** Central-axis timeline that reveals projects a page at a time, fetching from `/api/projects` as needed. */
export function TimelineClient({ initial, pageSize }: TimelineClientProps) {
  const [items, setItems] = useState<TimelineProject[]>(initial.items);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [visible, setVisible] = useState(pageSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visibleItems = items.slice(0, visible);
  const canReveal = visible < items.length || hasMore;

  const { width, heights, containerRef, registerCard } = useTimelineMeasure(
    visibleItems.length,
  );

  async function loadMore() {
    const next = visible + pageSize;

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

  const fadeMask =
    "linear-gradient(to bottom, #000 calc(100% - 16rem), transparent 100%)";

  const layout = computeLayout(visibleItems, heights);
  const centerX = width / 2;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative"
        style={
          canReveal
            ? { maskImage: fadeMask, WebkitMaskImage: fadeMask }
            : undefined
        }
      >
        {/* Desktop: condensed two-column layout with connector lines. */}
        <div
          className="relative hidden lg:block"
          style={{ height: layout.height }}
        >
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-ink-muted/40"
          />

          {width > 0 ? (
            <FadeIn>
              <svg
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-0 text-ink-muted/60"
                width={width}
                height={layout.height}
              >
                {layout.placements.map((p) => {
                  const edgeX = p.isPro ? centerX - GUTTER : centerX + GUTTER;
                  const midX = p.isPro ? centerX - GUTTER / 2 : centerX + GUTTER / 2;
                  return (
                    <polyline
                      key={p.id}
                      points={`${centerX},${p.dotY} ${midX},${p.dotY} ${midX},${p.anchorY} ${edgeX},${p.anchorY}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                    />
                  );
                })}
              </svg>
            </FadeIn>
          ) : null}

          {layout.placements.map(
            (p) =>
              p.showYear && (
                <span
                  key={`year-${p.id}`}
                  className="absolute left-1/2 z-20 -translate-x-1/2 bg-paper px-2 text-sm font-bold tabular-nums text-ink"
                  style={{ top: p.dotY - 30 }}
                >
                  {p.year}
                </span>
              ),
          )}

          {layout.placements.map((p) => (
            <span
              key={`dot-${p.id}`}
              aria-hidden
              className="absolute left-1/2 z-20 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper"
              style={{ top: p.dotY }}
            />
          ))}

          {visibleItems.map((project, i) => {
            const p = layout.placements[i];
            return (
              <FadeIn
                key={project.id}
                as="div"
                delay={(i % pageSize) * 40}
                className={clsx(
                  "absolute z-10",
                  p.isPro ? "left-0" : "right-0",
                )}
                style={{
                  top: p.top,
                  width: `calc(50% - ${GUTTER}px)`,
                }}
              >
                <div ref={registerCard(project.id)}>
                  <ProjectCard project={project} />
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Mobile: condensed single column against a left axis. */}
        <div className="relative lg:hidden">
          <div
            aria-hidden
            className="absolute bottom-0 left-4 top-0 w-px bg-ink-muted/40"
          />
          <ol className="space-y-6">
            {visibleItems.map((project, i) => {
              const year = project.startDate.slice(0, 4);
              const showYear =
                i === 0 || visibleItems[i - 1].startDate.slice(0, 4) !== year;

              return (
                <li key={project.id}>
                  {showYear ? (
                    <div className="relative mb-6 flex items-center">
                      <span className="ml-4 bg-paper px-2 text-sm font-bold tabular-nums text-ink">
                        {year}
                      </span>
                    </div>
                  ) : null}

                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute left-4 top-8 z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink bg-paper"
                    />
                    <span
                      aria-hidden
                      className="absolute left-4 top-8 h-px w-6 -translate-y-1/2 bg-ink-muted/60"
                    />
                    <FadeIn as="div" className="ml-10" delay={(i % pageSize) * 40}>
                      <ProjectCard project={project} />
                    </FadeIn>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
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
