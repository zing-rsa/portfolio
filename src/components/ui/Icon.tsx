import { clsx } from "./clsx";

interface IconProps {
  /** An SVG path string (resolve via lib/icons on the server), or null. */
  path: string | null;
  /** Accessible label; omit for purely decorative icons. */
  label?: string;
  size?: number;
  className?: string;
}

/**
 * Renders a single-colour (currentColor) glyph from an SVG path string. Kept
 * free of any simple-icons import so it is safe in client bundles. When no path
 * resolves it falls back to a small bordered square, so missing brand icons
 * never break the layout.
 */
export function Icon({ path, label, size = 18, className }: IconProps) {
  if (!path) {
    return (
      <span
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
        className={clsx("inline-block border border-current align-middle", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <svg
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={clsx("inline-block align-middle", className)}
    >
      {label ? <title>{label}</title> : null}
      <path d={path} />
    </svg>
  );
}
