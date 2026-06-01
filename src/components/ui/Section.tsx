import { clsx } from "./clsx";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Terminal-style label shown above the section, e.g. "~/projects". */
  label?: string;
}

/**
 * Page section wrapper: constrains width, adds vertical rhythm, and optionally
 * prints a monospace path-style label like a shell prompt.
 */
export function Section({
  label,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={clsx(
        "mx-auto w-full max-w-content px-6 py-20 sm:px-8 lg:py-28",
        className,
      )}
      {...props}
    >
      {label ? (
        <p className="mb-10 text-xs uppercase tracking-[0.3em] text-ink-muted">
          <span className="text-ink-faint">$</span> {label}
        </p>
      ) : null}
      {children}
    </section>
  );
}
