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
