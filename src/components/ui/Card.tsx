import { clsx } from "./clsx";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Bordered container with a faint terminal-window feel. Hover lifts the border
 * from faint to full ink — the only emphasis, no colour.
 */
export function Card({ as = "div", className, children, ...props }: CardProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={clsx(
        "border border-ink-muted/40 bg-paper p-5",
        "transition-colors duration-200 hover:border-ink",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
