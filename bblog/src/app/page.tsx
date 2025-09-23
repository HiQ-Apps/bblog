import HomeHero from "@/components/composite/homeHero";
import RecentCarousel from "@/components/composite/recentCarousel";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center space-y-4 md:space-y-8">
      <HomeHero />
      <RecentCarousel />
    </div>
  );
}
