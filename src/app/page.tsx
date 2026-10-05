import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Timeline } from "@/components/sections/Timeline";
import { Infra } from "@/components/sections/Infra";
import { Footer } from "@/components/sections/Footer";
import { LoveStar } from "@/components/sections/LoveStar";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Suspense>
        <LoveStar />
      </Suspense>
      <Hero />
        <Suspense>
          <Stats />
        </Suspense>
      <Infra />
      <Timeline />
      <Footer />
    </main>
  );
}
