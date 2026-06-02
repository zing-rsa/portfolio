import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Footer } from "@/components/sections/Footer";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Hero />
        <Suspense>
          <Stats />
        </Suspense>
      <Timeline />
      <Footer />
    </main>
  );
}
