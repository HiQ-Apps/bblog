"use client";

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

export default function RelevantList({
  tags,
  currentSlug,
  limit = 12,
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

  // Shuffle once per fetch and take top 3
  const topThree = useMemo(() => {
    const arr = [...relatedPosts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 3);
  }, [relatedPosts]);

  if (!canLoad) return null;

  return (
    <section className={(className ?? "") + " w-full"}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{heading}</h2>
        <Link
          href={`/blog?tags=${encodeURIComponent(tags.join(","))}`}
          className="text-sm underline"
        >
          See more
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="rounded-2xl border bg-card p-3 shadow-sm">
              <div className="aspect-[4/3] w-full animate-pulse rounded-lg bg-muted" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="mt-1 h-4 w-1/2 animate-pulse rounded bg-muted" />
            </li>
          ))}
        </ul>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="py-4 text-sm text-red-600">
          Could not load related posts: {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && topThree.length === 0 && (
        <p className="py-4 text-sm text-neutral-500">No related posts found.</p>
      )}

      {/* List (3 random) */}
      {!loading && !error && topThree.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topThree.map((p) => (
            <li key={p._id}>
              <Link href={`/blog/${p.slug}`} className="block h-full">
                <article className="h-full rounded-2xl border bg-card p-3 shadow-sm transition hover:shadow-md">
                  <div className="relative w-full overflow-hidden rounded-lg aspect-[4/3]">
                    {p.heroImage?.asset?.url ? (
                      <Image
                        src={p.heroImage.asset.url}
                        alt={p.heroImage.alt || p.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        draggable={false}
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg bg-muted" />
                    )}
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-base font-semibold">
                    {p.title}
                  </h3>

                  {p.preview ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {p.preview}
                    </p>
                  ) : null}
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
