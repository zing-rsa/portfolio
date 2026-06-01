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
  linkedin: "linkedin",
  discord: "discord",
  email: null, // custom path below
};

/** Resolve a simple-icons slug (e.g. "typescript") to its SVG path, or null. */
export function getIconPath(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return bySlug.get(slug.toLowerCase())?.path ?? null;
}

/** Resolve a hero social link to its SVG path. */
export function getSocialPath(key: SocialKey): string | null {
  if (key === "email") return EMAIL_PATH;
  return getIconPath(SOCIAL_SLUGS[key]);
}

/**
 * Resolve a list of `{ name, icon }` technologies to a render-ready shape with
 * the SVG path baked in. Used by server components and the projects API so the
 * client never needs simple-icons.
 */
export interface TechIcon {
  name: string;
  path: string | null;
}

export function resolveTechIcons(
  technologies: { name: string; icon?: string | null }[] | null | undefined,
): TechIcon[] {
  if (!technologies) return [];
  return technologies.map((t) => ({
    name: t.name,
    path: getIconPath(t.icon ?? t.name),
  }));
}
