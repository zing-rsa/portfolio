import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Footer } from "@/components/sections/Footer";

// Rendered per request: the timeline reads from Postgres (so CMS edits appear
// immediately) and there's no DB at build time in CI. GitHub fetches are still
// cached at the fetch layer (revalidate: 3600), so this stays cheap.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Hero />
      <Stats />
      <Timeline />
      <Footer />
    </main>
  );
}
