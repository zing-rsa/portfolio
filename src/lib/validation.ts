/**
 * Minimal hand-rolled validation for project create/update payloads — keeps the
 * dependency surface small ("native tools where possible"). Returns a tagged
 * result rather than throwing so route handlers can map errors to 400s.
 */
import type { NewProject, Technology } from "@/lib/db/schema";

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function asString(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : null;
}

function asOptionalString(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  return typeof v === "string" ? v.trim() : null;
}

function parseTechnologies(v: unknown): Technology[] {
  if (!Array.isArray(v)) return [];
  const out: Technology[] = [];
  for (const item of v) {
    if (item && typeof item === "object" && "name" in item) {
      const name = asString((item as Technology).name);
      if (name) {
        const icon = asOptionalString((item as Technology).icon);
        out.push(icon ? { name, icon } : { name });
      }
    }
  }
  return out;
}

/** Validate a create/update body into a `NewProject`. */
export function parseProjectInput(body: unknown): Result<NewProject> {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const type = b.type;
  if (type !== "professional" && type !== "personal") {
    return { ok: false, error: "type must be 'professional' or 'personal'" };
  }

  const title = asString(b.title);
  if (!title) return { ok: false, error: "title is required" };

  const description = asString(b.description);
  if (!description) return { ok: false, error: "description is required" };

  const startDate = asString(b.startDate);
  if (!startDate || !ISO_DATE.test(startDate)) {
    return { ok: false, error: "startDate must be YYYY-MM-DD" };
  }

  const endDate = asOptionalString(b.endDate);
  if (endDate && !ISO_DATE.test(endDate)) {
    return { ok: false, error: "endDate must be YYYY-MM-DD" };
  }

  const value: NewProject = {
    type,
    title,
    description,
    startDate,
    endDate,
    technologies: parseTechnologies(b.technologies),
    organization: type === "professional" ? asOptionalString(b.organization) : null,
    organizationIcon:
      type === "professional" ? asOptionalString(b.organizationIcon) : null,
    role: type === "professional" ? asOptionalString(b.role) : null,
    imageUrl: type === "personal" ? asOptionalString(b.imageUrl) : null,
    link: type === "personal" ? asOptionalString(b.link) : null,
    githubLink: type === "personal" ? asOptionalString(b.githubLink) : null,
  };

  return { ok: true, value };
}
