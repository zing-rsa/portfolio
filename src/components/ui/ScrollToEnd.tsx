"use client";

import { useEffect, useRef } from "react";
import { clsx } from "./clsx";

interface ScrollToEndProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Horizontally scrollable container that jumps to its right edge on mount, so
 * overflowing content (e.g. the contribution graph) reveals its most recent
 * end first instead of starting at the left.
 */
export function ScrollToEnd({
  className,
  children,
  ...props
}: ScrollToEndProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div ref={ref} className={clsx("overflow-x-auto", className)} {...props}>
      {children}
    </div>
  );
}
