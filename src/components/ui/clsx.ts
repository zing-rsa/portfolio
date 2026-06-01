/**
 * Tiny class-name joiner — avoids pulling in a dependency for the component
 * library. Falsy values are dropped so `clsx("a", cond && "b")` reads cleanly.
 */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
