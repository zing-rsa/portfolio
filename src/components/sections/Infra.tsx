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
            Interested in infrastructure?
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-muted">
            This site is served by a kubernetes cluster that I host all my projects on. If you are curious, check out a diagram and demo at&nbsp;
            <a
              href="https://infra.zingdev.xyz"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors text-ink"
            >
              infra.zingdev.xyz <Icon path={EXTERNAL_GLYPH} size={14} />
            </a>
          </p>
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
            loading="eager"
          />
        </div>
      </div>
    </Section>
  );
}
