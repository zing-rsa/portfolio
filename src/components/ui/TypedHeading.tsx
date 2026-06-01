"use client";

import { useEffect, useState } from "react";
import { clsx } from "./clsx";

interface TypedHeadingProps {
  text: string;
  className?: string;
  /** Milliseconds between characters. */
  speed?: number;
  as?: "h1" | "h2";
}

/**
 * Types `text` out character-by-character on mount with a blinking cursor.
 * Respects `prefers-reduced-motion`: reduced-motion users see the full string
 * immediately (cursor still blinks). This is animation #1 from the spec.
 */
export function TypedHeading({
  text,
  className,
  speed = 70,
  as = "h1",
}: TypedHeadingProps) {
  const [count, setCount] = useState(0);
  const Tag = as;

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setCount(text.length);
      return;
    }

    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

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
