// app/blog/page.tsx
import "server-only";
import { notFound } from "next/navigation";
import { getAllPostsPaginated } from "@/queries/Post";
import PostsFeed from "@/components/composite/postFeed";
import HorizontalAd from "@/components/composite/horizontalAd";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const PAGE_SIZE = 6;
  const { items, total } = await getAllPostsPaginated(0, PAGE_SIZE);
  if (!items) return notFound();

  return (
    <div className="w-full overflow-hidden">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 w-full">
        <header className="mb-6 md:mb-8">
          <h1 className="font-lora text-2xl md:text-3xl tracking-tight">
            Latest on the Blog
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Clean living, cozy rituals, and sustainable picks.
          </p>
        </header>

        <PostsFeed initialItems={items} total={total} pageSize={PAGE_SIZE} />

        <HorizontalAd className="mt-6 md:mt-8" />
      </div>
    </div>
  );
}
