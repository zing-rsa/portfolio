import { siteConfig } from "@/site.config";
import { getIcon } from "@/lib/icons";
import { encodeBase64 } from "@/lib/utils";
import { Icon, TypedHeading, LocalTime, CopyButton } from "@/components/ui";

/** Above-the-fold hero: typed heading, intro, social links and live local time. */
export function Hero() {
  const socials = siteConfig.socials.map((s) => ({
    ...s,
    icon: getIcon(s.key),
  }));

  return (
    <section className="mx-auto flex min-h-[88vh] w-full max-w-content flex-col justify-center px-6 py-24 sm:px-8">
      <p className="mb-6 text-sm text-ink-muted">
        <span className="text-ink-faint">$</span> whoami
      </p>

      <TypedHeading
        text={siteConfig.heading}
        pauseAfter={siteConfig.heading.split(/\s/)[0]?.length ?? 0}
        pauseMs={650}
        className="text-lg font-bold leading-tight sm:text-xl"
      />

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-md">
        {siteConfig.intro}
      </p>

      <nav
        aria-label="Social and contact links"
        className="mt-10 flex flex-wrap items-center gap-5"
      >
        {socials.map((s) =>
          s.copyValue ? (
            <CopyButton
              key={s.key}
              encoded={encodeBase64(s.copyValue)}
              label={s.label}
              icon={s.icon}
              size={20}
              className={"group inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"}
            />
          ) : (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noreferrer noopener"
              className={"group inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"}
            >
              <Icon icon={s.icon} label={s.label} size={20} />
              <span className="text-sm group-hover:underline">{s.label}</span>
            </a>
          ),
        )}
      </nav>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-faint">
        <span>
          <span className="text-ink-muted">loc:</span> {siteConfig.location}
        </span>
        <span>
          <span className="text-ink-muted">tz:</span> {siteConfig.timezone}{" "}
          <LocalTime timezone={siteConfig.timezone} />
        </span>
      </div>
    </section>
  );
}
