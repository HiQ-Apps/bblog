"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PostResponse } from "@/types/Post";

export type RelevantCarouselProps = {
  tags: string[];
  currentSlug?: string;
  limit?: number;
  className?: string;
  heading?: string;
};

export type RelatedApiRes =
  | { ok: true; items: PostResponse[]; hasMore: boolean }
  | { ok: false; error: string };

export default function RelevantCarousel({
  tags,
  currentSlug,
  limit = 6,
  className,
  heading = "Related Posts",
}: RelevantCarouselProps) {
  const [relatedPosts, setRelatedPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canLoad = useMemo(() => Array.isArray(tags) && tags.length > 0, [tags]);

  useEffect(() => {
    if (!canLoad) return;
    const ac = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams();
        qs.set("tags", tags.join(","));
        qs.set("limit", String(limit));
        if (currentSlug) qs.set("currentSlug", currentSlug);

        const res = await fetch(`/api/posts/tags/related?${qs.toString()}`, {
          method: "GET",
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`Request failed with ${res.status}`);

        const data: RelatedApiRes = await res.json();
        if (!data.ok) throw new Error(data.error);
        setRelatedPosts(data.items);
      } catch (e: any) {
        if (e?.name !== "AbortError")
          setError(e?.message ?? "Failed to load related posts");
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => ac.abort();
  }, [canLoad, currentSlug, limit, tags]);

  if (!canLoad) return null;

  return (
    <section className={className + " w-full"}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{heading}</h2>
        <Link
          href={`/blog?tags=${encodeURIComponent(tags.join(","))}`}
          className="text-sm underline"
        >
          See more
        </Link>
      </div>

      {loading && (
        <div className="flex gap-4 py-4 overflow-x-auto">
          {Array.from({ length: Math.min(3, limit) }).map((_, i) => (
            <div key={i} className="w-64 shrink-0">
              <div className="h-36 w-full animate-pulse rounded-lg bg-muted" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="py-4 text-sm text-red-600">
          Could not load related posts: {error}
        </p>
      )}

      {!loading && !error && relatedPosts.length === 0 && (
        <p className="py-4 text-sm text-neutral-500">No related posts found.</p>
      )}

      {!loading && !error && relatedPosts.length > 0 && (
        <div className="mt-3 w-full overflow-hidden">
          <Carousel
            opts={{
              align: "center",
              loop: false,
              containScroll: "trimSnaps",
              skipSnaps: false,
              dragFree: false,
              slidesToScroll: 2,
            }}
          >
            {/* stable gutters: negative margin matches item padding */}
            <CarouselContent>
              {relatedPosts.map((p) => (
                <CarouselItem key={p._id} className="w-64 pl-3 lg:basis-1/2">
                  <Link href={`/blog/${p.slug}`} className="block">
                    <article className="rounded-2xl flex flex-col justify-center items-center w-96 border bg-card p-3 shadow-sm transition hover:shadow-md">
                      {p.heroImage?.asset?.url ? (
                        <Image
                          src={p.heroImage.asset.url}
                          alt={p.heroImage.alt || p.title}
                          width={320} /* match w-[18rem] */
                          height={320}
                          className="rounded-lg object-cover"
                          loading="lazy"
                          decoding="async"
                          sizes="1080px" /* always render at fixed width */
                          draggable={false}
                        />
                      ) : (
                        <div className="h-40 w-full rounded-lg bg-muted" />
                      )}
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold">
                        {p.title}
                      </h3>
                      {p.preview && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {p.preview}
                        </p>
                      )}
                    </article>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* keep controls inside bounds and centered below */}
            <div className="my-3 flex w-full justify-center gap-3">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      )}
    </section>
  );
}
