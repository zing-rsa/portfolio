/**
 * Global icon overrides.
 *
 * The icon resolver in `./icons` consults this map BEFORE simple-icons, keyed by
 * a lower-cased name/slug. Because every section (hero socials, project tech
 * badges, and the GitHub-derived pinned / languages / "most used" lists) goes
 * through that resolver, an entry here fixes an icon everywhere at once.
 *
 * Three kinds of entry:
 *   1. Alias        — `{ slug: "cplusplus" }` points a name at an existing
 *      simple-icons slug. Use this when the icon exists but under a different
 *      name than the one coming in (e.g. GitHub reports "C++", the slug is
 *      "cplusplus"). The simple-icons brand colour is used automatically.
 *   2. Alias + colour — `{ slug: "react", color: "#fff" }` reuses the
 *      simple-icons SVG path for that slug but overrides its brand colour with
 *      the given hex (used as-is). For when the glyph is right but the colour
 *      isn't (e.g. recolouring a brand icon to suit the theme).
 *   3. Custom       — `{ path, color }` supplies a 24×24 SVG path and a hex
 *      colour for icons simple-icons doesn't ship at all (e.g. C#, which was
 *      removed for trademark reasons). `path` is the SVG `d` data.
 *
 * Keys are matched case-insensitively. Add as many keys per icon as you expect
 * to encounter (e.g. both "c#" and "csharp").
 */

export type IconOverride =
  | { slug: string } // alias, simple-icons brand colour
  | { slug: string; color: string } // alias, colour overridden
  | { path: string; color: string }; // fully custom icon

// C# (simple-icons removed it). Single-path glyph from Material Design Icons
// (Apache-2.0), 24×24 viewBox. Colour is the C# brand purple — change to taste
// (GitHub itself uses green #178600 for the C# language label).
const CSHARP_PATH =
  "m11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39c-.57.13-1.24.2-2.01.2c-2.21-.04-3.87-.7-4.98-1.96Q2 15.135 2 12.21c.05-2.31.72-4.08 2-5.32C5.32 5.64 6.96 5 8.94 5c.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49l-1.06-.34c-.4-.1-.86-.15-1.39-.15c-1.16-.01-2.12.36-2.87 1.1c-.76.73-1.15 1.85-1.18 3.34c0 1.36.37 2.42 1.08 3.2c.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32M13.89 19l.61-4H13l.34-2h1.5l.32-2h-1.5L14 9h1.5l.61-4h2l-.61 4h1l.61-4h2l-.61 4H22l-.34 2h-1.5l-.32 2h1.5L21 15h-1.5l-.61 4h-2l.61-4h-1l-.61 4zm2.95-6h1l.32-2h-1z";

export const iconOverrides: Record<string, IconOverride> = {
  // Custom icon (no simple-icons entry):
  "c#": { path: CSHARP_PATH, color: "#9B4F96" },
  csharp: { path: CSHARP_PATH, color: "#9B4F96" },

  // Aliases — names that differ from their simple-icons slug:
  "c++": { slug: "cplusplus" },
  "f#": { slug: "fsharp" },
  ".net": { slug: "dotnet" },

  // Alias + colour override — right glyph, custom colour. Example:
  "haskell": { slug: "haskell", color: "#8F4E8B" },
};
