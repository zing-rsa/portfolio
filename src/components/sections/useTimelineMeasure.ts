"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface TimelineMeasure {
  /** True at the lg breakpoint, where the two-column layout is active. */
  isDesktop: boolean;
  /** Measured width of the timeline container (drives SVG sizing). */
  width: number;
  /** Measured heights of registered cards, keyed by project id. */
  heights: Record<string, number>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref callback to register/unregister a card element for measurement. */
  registerCard: (id: string) => (el: HTMLElement | null) => void;
}

/**
 * Tracks everything the desktop timeline layout needs from the DOM: the active
 * breakpoint, the container width, and per-card heights (re-measured via
 * ResizeObserver). Isolated from `TimelineClient` so the component only deals
 * with data + rendering. `visibleCount` re-triggers measurement as cards mount.
 */
export function useTimelineMeasure(visibleCount: number): TimelineMeasure {
  const [isDesktop, setIsDesktop] = useState(false);
  const [width, setWidth] = useState(0);
  const [heights, setHeights] = useState<Record<string, number>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const cardEls = useRef<Map<string, HTMLElement>>(new Map());

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
  }, [isDesktop, visibleCount, width, measure]);

  useEffect(() => {
    if (!isDesktop) return;
    const ro = new ResizeObserver(() => measure());
    cardEls.current.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [isDesktop, visibleCount, measure]);

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

  return { isDesktop, width, heights, containerRef, registerCard };
}
