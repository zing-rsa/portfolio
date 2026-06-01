import Image from "next/image";
import type { TimelineProject } from "@/lib/projects";
import { Icon, clsx } from "@/components/ui";
import { GITHUB_GLYPH, EXTERNAL_GLYPH } from "@/components/ui/glyphs";

function formatRange(start: string, end: string | null): string {
  const fmt = (iso: string) => {
    const [year] = iso.split("-");
    const month = new Date(`${iso}T00:00:00Z`).toLocaleString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    return `${month} ${year}`;
  };
  return `${fmt(start)} → ${end ? fmt(end) : "present"}`;
}

function TechBadges({ tech }: { tech: TimelineProject["technologies"] }) {
  if (tech.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tech.map((t) => (
        <li
          key={t.name}
          className="inline-flex items-center gap-1.5 border border-ink-muted/40 px-2 py-1 text-xs text-ink-muted"
        >
          <Icon icon={t} size={12} />
          {t.name}
        </li>
      ))}
    </ul>
  );
}

/**
 * A single timeline card: professional (organization + role) or personal
 * (optional screenshot + external/repo links).
 */
export function ProjectCard({ project }: { project: TimelineProject }) {
  const isPro = project.type === "professional";

  return (
    <article
      className={clsx(
        "border border-ink-muted/40 bg-paper p-5 transition-colors duration-200 hover:border-ink",
        isPro ? "lg:text-right" : "lg:text-left",
      )}
    >
      <div
        className={clsx(
          "flex items-center gap-2 text-xs uppercase tracking-widest text-ink-faint",
          isPro && "lg:justify-end",
        )}
      >
        <span>{isPro ? "professional" : "personal"}</span>
        <span aria-hidden>·</span>
        <span className="tabular-nums normal-case tracking-normal">
          {formatRange(project.startDate, project.endDate)}
        </span>
      </div>

      {isPro && (project.organization || project.role) ? (
        <div
          className={clsx(
            "mt-3 flex items-center gap-2",
            "lg:justify-end",
          )}
        >
          {project.organizationIcon ? (
            <Icon
              icon={project.organizationIcon}
              size={16}
              label={project.organization ?? undefined}
            />
          ) : null}
          <span className="text-sm font-bold">{project.organization}</span>
          {project.role ? (
            <span className="text-sm text-ink-muted">· {project.role}</span>
          ) : null}
        </div>
      ) : null}

      {!isPro && project.imageUrl ? (
        <div className="mt-3 overflow-hidden border border-ink-muted/30">
          <Image
            src={project.imageUrl}
            alt={project.title}
            width={640}
            height={360}
            className="h-auto w-full object-cover grayscale"
          />
        </div>
      ) : null}

      <h3 className="mt-3 text-lg font-bold">{project.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        {project.description}
      </p>

      {!isPro && (project.link || project.githubLink) ? (
        <div className="mt-4 flex flex-wrap gap-4">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink hover:underline"
            >
              <Icon path={EXTERNAL_GLYPH} size={14} /> live
            </a>
          ) : null}
          {project.githubLink ? (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink hover:underline"
            >
              <Icon path={GITHUB_GLYPH} size={14} /> source
            </a>
          ) : null}
        </div>
      ) : null}

      <div className={clsx(isPro && "lg:flex lg:justify-end")}>
        <TechBadges tech={project.technologies} />
      </div>
    </article>
  );
}
