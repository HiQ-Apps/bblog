"use client";

import { useState } from "react";
import HomeHero from "@/components/composite/homeHero";
import HomeCarousel from "@/components/composite/homeCarousel";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main className="flex w-full flex-col items-center space-y-6 md:space-y-10">
      <HomeHero onReady={() => setHeroReady(true)} />
      <HomeCarousel heroReady={heroReady} />
    </main>
  );
}
