import { siteConfig } from "@/site.config";
import { getSocialPath } from "@/lib/icons";
import { Icon } from "@/components/ui";

const emailLink = siteConfig.socials.find((s) => s.key === "email");

/** Light closing section — an invitation to get in touch. */
export function Footer() {
  return (
    <footer className="border-t border-ink-muted/30">
      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-6 px-6 py-16 sm:px-8 sm:py-20">
        <p className="text-lg text-ink sm:text-xl">{siteConfig.footer}</p>

        {emailLink ? (
          <a
            href={emailLink.href}
            className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink hover:underline"
          >
            <Icon path={getSocialPath("email")} label="Email" size={18} />
            <span className="text-sm">{emailLink.href.replace("mailto:", "")}</span>
          </a>
        ) : null}

        <p className="mt-4 text-xs text-ink-faint">
          <span className="text-ink-muted">$</span> {siteConfig.name} —{" "}
          built with next.js · deployed on kubernetes
        </p>
      </div>
    </footer>
  );
}
