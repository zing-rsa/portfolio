import { siteConfig } from "@/site.config";
import { getSocial } from "@/lib/icons";
import { CopyButton } from "@/components/ui";

const emailLink = siteConfig.socials.find((s) => s.key === "email");

/** Light closing section — an invitation to get in touch. */
export function Footer() {
  return (
    <footer className="border-t border-ink-muted/30">
      <div className="mx-auto flex w-full max-w-content flex-col items-start gap-6 px-6 py-16 sm:px-8 sm:py-20">
        <p className="text-lg text-ink sm:text-xl">{siteConfig.footer}</p>

        {emailLink?.copyValue ? (
          <CopyButton
            encoded={Buffer.from(emailLink.copyValue, "utf8").toString("base64")}
            label="Email"
            icon={getSocial("email")}
            size={18}
            className="inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
          />
        ) : null}

        <p className="mt-4 text-xs text-ink-faint">
          <span className="text-ink-muted">$</span> {siteConfig.name} —{" "}
          built with next.js · deployed on kubernetes
        </p>
      </div>
    </footer>
  );
}
