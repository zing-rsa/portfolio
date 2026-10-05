"use client";

import { useEffect, useState } from "react";
import { clsx } from "@/lib/utils";

interface TypedHeadingProps {
  text: string;
  className?: string;
  /** Milliseconds between characters. */
  speed?: number;
  /** Insert a longer pause once this many characters have been typed. */
  pauseAfter?: number;
  /** Length of that pause, in ms. */
  pauseMs?: number;
  as?: "h1" | "h2";
}

/**
 * Types `text` out character-by-character on mount with a blinking cursor.
 * Respects `prefers-reduced-motion` (full string shown immediately).
 */
export function TypedHeading({
  text,
  className,
  speed = 70,
  pauseAfter,
  pauseMs = 600,
  as = "h1",
}: TypedHeadingProps) {
  const [count, setCount] = useState(0);
  const Tag = as;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Intentional: sync to the full string once when the user prefers
      // reduced motion. Done in an effect (not lazy init) to stay SSR-safe,
      // since matchMedia is unavailable during server rendering.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(text.length);
      return;
    }

    let i = 0;
    let timer: number;

    const step = () => {
      i += 1;
      setCount(i);
      if (i >= text.length) return;
      const delay = i === pauseAfter ? pauseMs : speed;
      timer = window.setTimeout(step, delay);
    };

    // Type the first character immediately so typing starts the instant the
    // component hydrates — no leading `speed`-length pause.
    step();
    return () => window.clearTimeout(timer);
  }, [text, speed, pauseAfter, pauseMs]);

  const done = count >= text.length;

  return (
    <Tag className={clsx("font-mono", className)} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      <span
        aria-hidden="true"
        className={clsx(
          "ml-0.5 inline-block w-[0.6ch] -translate-y-[2px] border-b-[0.18em] border-ink align-baseline",
          done ? "animate-blink" : "",
        )}
      >
        &nbsp;
      </span>
    </Tag>
  );
}
