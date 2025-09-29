"use client";

import { useState } from "react";
import HomeHero from "@/components/composite/homeHero";
import RecentPostsCarousel from "@/components/composite/recentCarousel";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main className="flex w-full flex-col items-center space-y-6 md:space-y-10">
      <HomeHero onReady={() => setHeroReady(true)} />
      <RecentPostsCarousel heroReady={heroReady} limit={6} />
    </main>
  );
}
