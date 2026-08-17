import { clsx } from "@/lib/utils";

/**
 * Shared card surface: a faint terminal-window border that lifts to full ink on
 * hover — the only emphasis, no colour. Applied directly (via `clsx`) by
 * elements that can't be a plain `<div>`, e.g. an anchor or article.
 */
export const cardSurface =
  "border border-ink-muted/40 bg-paper p-5 transition-colors duration-200 hover:border-ink";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
}

/** Bordered container built on {@link cardSurface}. */
export function Card({ as = "div", className, children, ...props }: CardProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={clsx(cardSurface, className)} {...props}>
      {children}
    </Tag>
  );
}
