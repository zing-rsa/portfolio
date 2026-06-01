import { clsx } from "./clsx";

/** Render-ready icon data (matches the shape returned by `@/lib/icons`). */
interface IconData {
  path?: string | null;
  /** Raw inner SVG markup for arbitrary multi-element icons. */
  svg?: string | null;
  viewBox?: string;
  color?: string | null;
}

interface IconProps extends IconData {
  /** Alternative to the individual fields: pass a resolved icon bundle. */
  icon?: IconData | null;
  /** Accessible label; omit for purely decorative icons. */
  label?: string;
  size?: number;
  className?: string;
}

/**
 * Renders an icon. Three shapes, in priority order:
 *  - `svg`: arbitrary inner SVG markup (multiple paths/colours), rendered inside
 *    a sized wrapper using the icon's own viewBox.
 *  - `path`: a single SVG path, filled with `color` (or `currentColor`).
 *  - neither: a small bordered square placeholder.
 *
 * The `svg` markup comes only from code (`@/lib/icon-overrides.ts`), never user
 * input, so injecting it is as trusted as authoring JSX.
 *
 * Kept free of any simple-icons import so it is safe in client bundles.
 */
export function Icon({
  icon,
  label,
  size = 18,
  className,
  ...rest
}: IconProps) {
  const path = icon?.path ?? rest.path ?? null;
  const svg = icon?.svg ?? rest.svg ?? null;
  const viewBox = icon?.viewBox ?? rest.viewBox ?? "0 0 24 24";
  const color = icon?.color ?? rest.color ?? null;

  const a11y = {
    role: label ? ("img" as const) : undefined,
    "aria-label": label,
    "aria-hidden": label ? undefined : (true as const),
  };

  if (svg) {
    return (
      <svg
        {...a11y}
        viewBox={viewBox}
        width={size}
        height={size}
        // Only force a fill when a colour is given; otherwise let the SVG's own
        // fills/styles apply (e.g. a multi-colour logo).
        fill={color ?? undefined}
        className={clsx("inline-block align-middle", className)}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }

  if (path) {
    return (
      <svg
        {...a11y}
        viewBox={viewBox}
        width={size}
        height={size}
        fill={color ?? "currentColor"}
        className={clsx("inline-block align-middle", className)}
      >
        {label ? <title>{label}</title> : null}
        <path d={path} />
      </svg>
    );
  }

  return (
    <span
      {...a11y}
      className={clsx(
        "inline-block border border-current align-middle",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
