import Image from "next/image";
import { Section, Icon } from "@/components/ui";
import { EXTERNAL_GLYPH } from "@/components/ui/glyphs";

/** Self-hosting call-out with an infrastructure diagram. */
export function Infra() {
  return (
    <Section label="~/infra" id="infra">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
            Interested in how I host this site?
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted">
            I run all my side projects on a self managed kubernetes cluster.
          </p>
          <span className="group-hover:underline text-sm text-ink-muted">Read more at </span>
          <a
            href="https://infra.zingdev.xyz"
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            infra.zingdev.xyz
            <Icon path={EXTERNAL_GLYPH} size={14} />
          </a>
        </div>

        <div
          className="relative aspect-[16/12] w-full overflow-hidden lg:w-[120%] lg:max-w-none"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 60%, transparent 100%)",
          }}
        >
          <Image
            src="/lab-diagram.svg"
            alt="Diagram of the self-managed kubernetes infrastructure"
            width={1280}
            height={720}
            className="absolute inset-x-0 top-0 h-auto w-full"
          />
        </div>
      </div>
    </Section>
  );
}
