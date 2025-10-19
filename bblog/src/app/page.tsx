"use client";

import { useState } from "react";
import HeroVideo from "@/components/composite/HeroVideo";
import RecentPostsCarousel from "@/components/composite/recentCarousel";
import HorizontalAd from "@/components/composite/horizontalAd";
import HighlightedCarousel from "@/components/composite/highlightedCarousel";
import AboutCard from "@/components/composite/aboutCard";

export default function Home() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <main className="flex w-full flex-col items-center space-y-6 md:space-y-10">
      <HeroVideo onIntroDone={() => setHeroReady(true)} />
      <AboutCard />
      <RecentPostsCarousel limit={6} />
      <HighlightedCarousel />
      <HorizontalAd className="my-2" />
    </main>
  );
}
