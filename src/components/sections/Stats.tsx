import { getGithubStats, type CalendarDay } from "@/lib/github/stats";
import { getIconPath, getIcon } from "@/lib/icons";
import { Section, Card, Icon, FadeIn, ScrollToEnd } from "@/components/ui";

const LEVEL_BG = [
  "bg-ink/[0.07]",
  "bg-ink/25",
  "bg-ink/45",
  "bg-ink/70",
  "bg-ink",
];

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tabular-nums sm:text-3xl">
        {value.toLocaleString()}
      </span>
      <span className="text-xs uppercase tracking-widest text-ink-muted">
        {label}
      </span>
    </div>
  );
}

function Calendar({ weeks }: { weeks: CalendarDay[][] }) {
  return (
    <div>
      <div className="mx-auto w-fit max-w-full">
        <h3 className="mb-3 text-sm text-ink-muted">
          contribution graph · last year
        </h3>
        <ScrollToEnd className="pb-2">
          <div className="flex gap-[3px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.date}: ${day.count} contributions`}
                    className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_BG[day.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollToEnd>
        <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-ink-faint">
          <span>less</span>
          {LEVEL_BG.map((bg, i) => (
            <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${bg}`} />
          ))}
          <span>more</span>
        </div>
      </div>
    </div>
  );
}

function RepoCard({
  repo,
}: {
  repo: { name: string; nameWithOwner?: string; description: string | null; url: string; stars: number; language: string | null };
}) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-full min-w-0 flex-col gap-2 border border-ink-muted/40 bg-paper p-5 transition-colors duration-200 hover:border-ink"
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-bold">
          {repo.nameWithOwner ?? repo.name}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-xs text-ink-muted">
          <Icon path={getIconPath("github")} size={12} /> {repo.stars}
        </span>
      </div>
      {repo.description ? (
        <p className="line-clamp-2 text-xs leading-relaxed text-ink-muted">
          {repo.description}
        </p>
      ) : null}
      {repo.language ? (
        <span className="mt-auto inline-flex items-center gap-1 text-xs text-ink-faint">
          <Icon icon={getIcon(repo.language.toLowerCase())} size={12} />
          {repo.language}
        </span>
      ) : null}
    </a>
  );
}

function LanguageBars({ langs }: { langs: { name: string; bytes: number }[] }) {
  const max = Math.max(1, ...langs.map((l) => l.bytes));
  return (
    <div>
      <h3 className="mb-3 text-sm text-ink-muted">most used</h3>
      <ul className="flex flex-col gap-2">
        {langs.map((l) => {
          const icon = getIcon(l.name.toLowerCase());
          return (
          <li key={l.name} className="flex min-w-0 items-center gap-3 text-xs">
            <Icon icon={icon} size={14} className="shrink-0" />
            <span className="w-20 shrink-0 truncate sm:w-24">{l.name}</span>
            <span className="h-2 min-w-0 flex-1 bg-ink/[0.07]">
              <span
                className="block h-full bg-ink"
                style={{ width: `${(l.bytes / max) * 100}%` }}
              />
            </span>
          </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Stats section overview. Server component; sources data from GitHub and
 * degrades gracefully without a token.
 */
export async function Stats() {
  const stats = await getGithubStats();

  if (!stats) {
    return (
      <Section label="~/stats" id="stats">
        <FadeIn>
          <Card className="text-sm text-ink-muted">
            GitHub stats are unavailable. Set <code>GITHUB_TOKEN</code> and a
            valid <code>github.username</code> in <code>site.config.ts</code> to
            populate this section.
          </Card>
        </FadeIn>
      </Section>
    );
  }

  return (
    <Section label="~/stats" id="stats">
      <FadeIn className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="personal repos" value={stats.publicRepos} />
        <Stat label="github stars" value={stats.totalStars} />
        <Stat label="ytd contributions" value={stats.totalContributions} />
        <Stat label="github followers" value={stats.followers} />
        <Stat label="github following" value={stats.following} />
        <Stat label="github starred" value={stats.starredCount} />
      </FadeIn>

      <FadeIn className="mt-12">
        <Calendar weeks={stats.calendarWeeks} />
      </FadeIn>

      {stats.pinned.length > 0 ? (
        <FadeIn className="mt-12">
          <h3 className="mb-4 text-sm text-ink-muted">repos I&apos;m proud of</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.pinned.map((repo) => (
              <RepoCard key={repo.url} repo={repo} />
            ))}
          </div>
        </FadeIn>
      ) : null}

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {stats.topLanguages.length > 0 ? (
          <FadeIn className="min-w-0">
            <LanguageBars langs={stats.topLanguages} />
          </FadeIn>
        ) : null}

        {stats.starredSample.length > 0 ? (
          <FadeIn className="min-w-0">
            <h3 className="mb-4 text-sm text-ink-muted">recently starred</h3>
            <ul className="flex flex-col divide-y divide-ink-muted/20">
              {stats.starredSample.map((repo) => (
                <li key={repo.url} className="min-w-0 py-2">
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-w-0 items-center justify-between gap-3 text-sm hover:underline"
                  >
                    <span className="min-w-0 truncate">{repo.nameWithOwner ?? repo.name}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-ink-muted">
                      <Icon path={getIconPath("github")} size={12} /> {repo.stars}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </FadeIn>
        ) : null}
      </div>
    </Section>
  );
}
