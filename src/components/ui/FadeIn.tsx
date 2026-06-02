"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/utils";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Delay before fading in, in ms — used to subtly stagger lists. */
  delay?: number;
  as?: "div" | "li" | "article";
}

/**
 * Fades children in/out as they enter/leave the viewport via an
 * IntersectionObserver. Reduced-motion is handled in globals.css.
 */
export function FadeIn({
  delay = 0,
  as = "div",
  className,
  style,
  children,
  ...props
}: FadeInProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"init" | "in" | "out">("init");
  const Tag = as as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting ? "in" : "out");
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx(
        "fade-init",
        state === "in" && "fade-in",
        state === "out" && "fade-out",
        className,
      )}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
