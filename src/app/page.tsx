import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Footer } from "@/components/sections/Footer";

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
