"use client";

import { useState } from "react";
import HeroVideo from "@/components/composite/HeroVideo";
import RecentPostsCarousel from "@/components/composite/recentCarousel";
import HorizontalAd from "@/components/composite/horizontalAd";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main className="flex w-full flex-col items-center space-y-6 md:space-y-10">
      <HeroVideo onReady={() => setHeroReady(true)} />
      <RecentPostsCarousel heroReady={heroReady} limit={6} />
      <HorizontalAd className="my-8" />
    </main>
  );
}
