"use client";

import { useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui";
import {
  HEART_GLYPH,
  HEART_OUTLINE_GLYPH,
  GITHUB_GLYPH,
} from "@/components/ui/glyphs";
import { clsx, formatCompact } from "@/lib/utils";

/** localStorage flag so each browser only contributes one love click. */
const LOVED_KEY = "portfolio:loved";

/** The one splash of colour on an otherwise monochrome site. */
const HEART_RED = "#ff5c5c";

/** SSR-safe read of the persisted "already loved" flag via useSyncExternalStore. */
function subscribeLoved(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

interface LoveStarBarProps {
  initialLove: number;
  stars: number | null;
  repoUrl: string;
}

/**
 * Fixed top-right widget: a "leave some love" tally on the left (one click per
 * browser, persisted globally) and a GitHub star link with its count on the
 * right. The love click is optimistic and reconciles with the server total.
 */
export function LoveStarBar({ initialLove, stars, repoUrl }: LoveStarBarProps) {
  const [love, setLove] = useState(initialLove);
  const [pending, setPending] = useState(false);
  const [justLoved, setJustLoved] = useState(false);
  const [pop, setPop] = useState(false);
  const persistedLoved = useSyncExternalStore(
    subscribeLoved,
    () => localStorage.getItem(LOVED_KEY) === "1",
    () => false,
  );
  const loved = persistedLoved || justLoved;

  async function onLove() {
    if (loved || pending) return;
    setPending(true);
    setJustLoved(true);
    setPop(true);
    setLove((n) => n + 1);
    localStorage.setItem(LOVED_KEY, "1");
    try {
      const res = await fetch("/api/love", { method: "POST" });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { count: number };
      setLove(data.count);
    } catch {
      setJustLoved(false);
      setLove((n) => Math.max(0, n - 1));
      localStorage.removeItem(LOVED_KEY);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed right-3 top-3 z-40 flex items-stretch border border-ink-muted/40 bg-paper/90 text-sm backdrop-blur-sm sm:right-4 sm:top-4">
      <button
        type="button"
        onClick={onLove}
        disabled={loved || pending}
        aria-pressed={loved}
        title={loved ? "you've left some love" : "leave some love"}
        className={clsx(
          "flex items-center gap-2 px-3 py-2 transition-colors disabled:cursor-default",
          loved ? "text-ink" : "text-ink-muted hover:text-ink",
        )}
      >
        <span
          className={clsx("inline-flex", pop && "animate-heartpop")}
          onAnimationEnd={() => setPop(false)}
        >
          <Icon
            path={loved ? HEART_GLYPH : HEART_OUTLINE_GLYPH}
            size={15}
            label="love"
            color={HEART_RED}
          />
        </span>
        <span className="hidden sm:inline">
          {loved ? "Thanks!" : "leave some love"}
        </span>
        <span className="min-w-[2ch] rounded-sm bg-ink/10 px-1.5 py-0.5 text-center text-xs tabular-nums">
          {formatCompact(love)}
        </span>
      </button>

      <span className="w-px bg-ink-muted/40" aria-hidden />

      <a
        href={repoUrl}
        target="_blank"
        rel="noreferrer noopener"
        title="star this repo on github"
        className="flex items-center gap-2 px-3 py-2 text-ink-muted transition-colors hover:text-ink"
      >
        <Icon path={GITHUB_GLYPH} size={15} label="github star" />
        <span className="hidden sm:inline">star</span>
        {stars !== null ? (
          <span className="min-w-[2ch] rounded-sm bg-ink/10 px-1.5 py-0.5 text-center text-xs tabular-nums">
            {formatCompact(stars)}
          </span>
        ) : null}
      </a>
    </div>
  );
}
