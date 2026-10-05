/** General-purpose helpers shared across the app. */

/** Join class names, dropping falsy values: `clsx("a", cond && "b")`. */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Base64-encode an ASCII string — used to keep a value (e.g. an email) out of
 * the rendered HTML until it's decoded on the client. Works in both the server
 * and browser (`btoa`/`atob` are global in both).
 */
export function encodeBase64(value: string): string {
  return btoa(value);
}

/** Decode a string produced by {@link encodeBase64}. */
export function decodeBase64(value: string): string {
  return atob(value);
}

/**
 * Compact, lowercase number formatting for small badges, e.g. 10, 100, 1k,
 * 100k, 1.2m. Keeps one fraction digit so counts stay legible as they grow.
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  })
    .format(value)
    .toLowerCase();
}
