/**
 * Server-side icon resolver.
 *
 * `simple-icons` ships ~3300 brand icons; importing the whole set into a client
 * bundle would be enormous. So this module resolves a slug to a plain SVG path
 * string on the server only, and we pass that string down to the client `Icon`
 * component. Keep imports of this module on the server (server components, route
 * handlers, seed scripts) — never in a "use client" module.
 */
import * as simpleIcons from "simple-icons";
import type { SocialKey } from "@/site.config";
import { iconOverrides } from "./icon-overrides";

interface SimpleIcon {
  title: string;
  slug: string;
  path: string;
  hex: string;
}

const bySlug: Map<string, SimpleIcon> = (() => {
  const map = new Map<string, SimpleIcon>();
  for (const value of Object.values(simpleIcons)) {
    if (
      value &&
      typeof value === "object" &&
      "slug" in value &&
      "path" in value
    ) {
      const icon = value as unknown as SimpleIcon;
      map.set(icon.slug, icon);
    }
  }
  return map;
})();

/** Generic envelope — email has no brand icon in simple-icons. */
const EMAIL_PATH =
  "M1.5 4.5h21A1.5 1.5 0 0 1 24 6v12a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 18V6a1.5 1.5 0 0 1 1.5-1.5Zm.6 1.8L12 12.9l9.9-6.6H2.1Zm19.8 1.68-7.74 5.16a1.5 1.5 0 0 1-1.32 0L4.1 8.78V17.7h17.8V8.78Z";

const SOCIAL_SLUGS: Record<SocialKey, string | null> = {
  github: "github",
  x: "x",
  discord: "discord",
  email: null, // custom path below
};

/** Light tone used when a brand colour is too dark to read on the dark theme. */
const DARK_FALLBACK = "#ededed";

/**
 * simple-icons brand colours are chosen for light backgrounds, so the very dark
 * ones (GitHub #181717, X #000, Next #000…) are invisible here. Keep the brand
 * colour unless its relative luminance is too low, then swap to a light tone.
 */
function readableColor(hex: string): string {
  const h = hex.replace("#", "");
  if (h.length < 6) return DARK_FALLBACK;
  const channel = (i: number) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance =
    0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance < 0.1 ? DARK_FALLBACK : `#${h}`;
}

export interface ResolvedIcon {
  /** Single-path glyph (simple-icons or a custom `path`). Null for `svg` icons. */
  path: string | null;
  /** Raw inner SVG markup, for arbitrary multi-element icons. */
  svg?: string | null;
  /** SVG viewBox; defaults to "0 0 24 24" at render time when omitted. */
  viewBox?: string;
  /** Fill colour (CSS hex). Null means render in the current text colour. */
  color: string | null;
}

const DEFAULT_VIEWBOX = "0 0 24 24";

/**
 * Split arbitrary SVG markup into its inner content and viewBox so we can
 * re-render it inside a sized wrapper `<svg>`. Falls back to a 24×24 viewBox.
 */
function parseSvg(markup: string): { inner: string; viewBox: string } {
  const viewBox = markup.match(/viewBox\s*=\s*["']([^"']+)["']/i)?.[1];
  const inner = markup.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)?.[1] ?? markup;
  return { inner: inner.trim(), viewBox: viewBox ?? DEFAULT_VIEWBOX };
}

/**
 * Core resolver, consulted by everything. Order: explicit overrides (aliases,
 * custom paths, or arbitrary SVGs) first, then simple-icons. This is what lets a
 * single `iconOverrides` entry fix an icon (e.g. C#) across every section.
 */
function resolve(name: string): ResolvedIcon | null {
  const key = name.toLowerCase();

  const override = iconOverrides[key];
  if (override) {
    if ("svg" in override) {
      const { inner, viewBox } = parseSvg(override.svg);
      return {
        path: null,
        svg: inner,
        viewBox: override.viewBox ?? viewBox,
        color: override.color ?? null,
      };
    }
    if ("path" in override) {
      return {
        path: override.path,
        viewBox: override.viewBox,
        color: override.color,
      };
    }
    const aliased = bySlug.get(override.slug.toLowerCase());
    if (aliased) {
      // Use the overridden colour as-is if given, else the brand colour.
      const color =
        "color" in override ? override.color : readableColor(aliased.hex);
      return { path: aliased.path, color };
    }
  }

  const icon = bySlug.get(key);
  return icon ? { path: icon.path, color: readableColor(icon.hex) } : null;
}

/** Resolve a slug/name to its SVG path + readable colour (overrides first). */
export function getIcon(slug: string | null | undefined): ResolvedIcon | null {
  return slug ? resolve(slug) : null;
}

/** Path-only resolver, for monochrome (currentColor) UI glyphs. */
export function getIconPath(slug: string | null | undefined): string | null {
  return slug ? (resolve(slug)?.path ?? null) : null;
}

/** Resolve a hero social link to its SVG path + brand colour. */
export function getSocial(key: SocialKey): ResolvedIcon | null {
  if (key === "email") return { path: EMAIL_PATH, color: DARK_FALLBACK };
  return getIcon(SOCIAL_SLUGS[key]);
}

/**
 * Resolve a list of `{ name, icon }` technologies to a render-ready shape with
 * the SVG path + brand colour baked in. Used by server components and the
 * projects API so the client never needs simple-icons.
 */
export interface TechIcon {
  name: string;
  path: string | null;
  svg?: string | null;
  viewBox?: string;
  color: string | null;
}

/**
 * Resolve a technology's `{ name, icon }` to a render-ready `{ path, color }`.
 * The slug (or name) is resolved via `getIcon`, which consults the code-defined
 * `iconOverrides` first and then simple-icons — the single source of truth for
 * what each slug looks like. Unknown slugs resolve to a null path (the `Icon`
 * component then shows its placeholder square).
 */
export function resolveTechIcons(
  technologies: { name: string; icon?: string | null }[] | null | undefined,
): TechIcon[] {
  if (!technologies) return [];
  return technologies.map((t) => {
    const resolved = getIcon(t.icon ?? t.name);
    return {
      name: t.name,
      path: resolved?.path ?? null,
      svg: resolved?.svg ?? null,
      viewBox: resolved?.viewBox,
      color: resolved?.color ?? null,
    };
  });
}
