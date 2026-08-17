/**
 * Pure geometry for the desktop two-column timeline: given the ordered projects
 * and their measured heights, it places each card near its axis dot, cascading
 * down only to avoid overlaps, and returns the total height. No React or DOM —
 * kept separate so the layout maths can be reasoned about (and tested) alone.
 */
import type { TimelineProject } from "@/lib/projects";

/** Desktop layout constants (px). */
export const TOP = 8;
const GAP = 28; // min vertical gap between stacked cards in a column
const ANCHOR = 32; // where a connector meets the card, measured from its top
const YEAR_GAP = 48; // extra axis space introduced by a new year label
export const GUTTER = 40; // gap between a column's inner edge and the central axis
const MIN_STEP = 72; // min axis spacing per project so dots never crowd
const FALLBACK_HEIGHT = 240; // used before a card has been measured

export interface Placement {
  id: string;
  isPro: boolean;
  top: number;
  dotY: number;
  anchorY: number;
  year: string;
  showYear: boolean;
}

export interface Layout {
  placements: Placement[];
  height: number;
}

export function computeLayout(
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
