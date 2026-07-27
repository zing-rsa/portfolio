"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TimelineProject, TimelinePage } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { Button, FadeIn } from "@/components/ui";
import { clsx } from "@/lib/utils";

interface TimelineClientProps {
  initial: TimelinePage;
  pageSize: number;
}

/** Projects shown before any expansion. */
const INITIAL_VISIBLE = 6;
/** Additional projects revealed per "load more" click. */
const VISIBLE_STEP = 6;

/** Desktop layout constants (px). */
const TOP = 8;
const GAP = 28; // min vertical gap between stacked cards in a column
const ANCHOR = 32; // where a connector meets the card, measured from its top
const YEAR_GAP = 48; // extra axis space introduced by a new year label
const GUTTER = 40; // gap between a column's inner edge and the central axis
const MIN_STEP = 72; // min axis spacing per project so dots never crowd
const FALLBACK_HEIGHT = 240; // used before a card has been measured

interface Placement {
  id: string;
  isPro: boolean;
  top: number;
  dotY: number;
  anchorY: number;
  year: string;
  showYear: boolean;
}

interface Layout {
  placements: Placement[];
  height: number;
}

function computeLayout(
  items: TimelineProject[],
  heights: Record<string, number>,
): Layout {
  const n = items.length;
  if (n === 0) return { placements: [], height: 0 };

  const h = (id: string) => heights[id] ?? FALLBACK_HEIGHT;

  let leftSum = 0;
  let rightSum = 0;
  let leftCount = 0;
  let rightCount = 0;
  for (const p of items) {
    if (p.type === "professional") {
      leftSum += h(p.id);
      leftCount += 1;
    } else {
      rightSum += h(p.id);
      rightCount += 1;
    }
  }
  const leftPacked = leftCount ? leftSum + GAP * (leftCount - 1) : 0;
  const rightPacked = rightCount ? rightSum + GAP * (rightCount - 1) : 0;
  const contentH = Math.max(leftPacked, rightPacked);
  const span = Math.max(contentH / n, MIN_STEP);

  // Evenly spaced dots along the axis. The first card hugs the top; later new
  // years add a gap so their label clears the preceding project.
  const dotY: number[] = [];
  const showYear: boolean[] = [];
  const years: string[] = [];
  let yearShift = 0;
  for (let i = 0; i < n; i++) {
    const year = items[i].startDate.slice(0, 4);
    const newYear = i === 0 || items[i - 1].startDate.slice(0, 4) !== year;
    if (newYear && i > 0) yearShift += YEAR_GAP;
    years[i] = year;
    showYear[i] = newYear;
    dotY[i] = TOP + yearShift + i * span + ANCHOR;
  }

  // Place each card near its dot, cascading down only to avoid overlaps.
  let leftCursor = TOP - GAP;
  let rightCursor = TOP - GAP;
  const placements: Placement[] = [];
  let maxBottom = 0;
  for (let i = 0; i < n; i++) {
    const p = items[i];
    const isPro = p.type === "professional";
    const desired = dotY[i] - ANCHOR;
    const cursor = isPro ? leftCursor : rightCursor;
    const top = Math.max(desired, cursor + GAP);
    if (isPro) leftCursor = top + h(p.id);
    else rightCursor = top + h(p.id);
    maxBottom = Math.max(maxBottom, top + h(p.id));

    placements.push({
      id: p.id,
      isPro,
      top,
      dotY: dotY[i],
      anchorY: top + ANCHOR,
      year: years[i],
      showYear: showYear[i],
    });
  }

  const axisEnd = dotY[n - 1] + ANCHOR;
  return { placements, height: Math.max(maxBottom, axisEnd) + TOP };
}

/** Central-axis timeline that reveals projects in chunks, fetching from `/api/projects` as needed. */
export function TimelineClient({ initial, pageSize }: TimelineClientProps) {
  const [items, setItems] = useState<TimelineProject[]>(initial.items);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [visible, setVisible] = useState(INITIAL_VISIBLE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<Map<string, HTMLElement>>(new Map());

  const visibleItems = items.slice(0, visible);
  const canReveal = visible < items.length || hasMore;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const measure = useCallback(() => {
    setHeights((prev) => {
      let changed = false;
      const next: Record<string, number> = { ...prev };
      cardEls.current.forEach((el, id) => {
        const h = el.offsetHeight;
        if (h && next[id] !== h) {
          next[id] = h;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, []);

  useLayoutEffect(() => {
    if (isDesktop) measure();
  }, [isDesktop, visibleItems.length, width, measure]);

  useEffect(() => {
    if (!isDesktop) return;
    const ro = new ResizeObserver(() => measure());
    cardEls.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [isDesktop, visibleItems.length, measure]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, [isDesktop]);

  const registerCard = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) cardEls.current.set(id, el);
      else cardEls.current.delete(id);
    },
    [],
  );

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
