"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PostCard } from "@/types/Post";

type Props = {
  initialItems: PostCard[];
  total: number;
  pageSize: number;
};

export default function PostsFeed({ initialItems, total, pageSize }: Props) {
  const [items, setItems] = useState<PostCard[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(initialItems.length >= total);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const hasMore = useMemo(
    () => !done && items.length < total,
    [done, items.length, total]
  );

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const offset = page * pageSize;
      const res = await fetch(
        `/api/posts/paginated?offset=${offset}&limit=${pageSize}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch more posts");

      const data: { items: PostCard[]; total: number } = await res.json();

      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage);

      const loadedCount = offset + data.items.length;
      if (loadedCount >= data.total || data.items.length === 0) {
        setDone(true);
      }
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, pageSize]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) fetchMore();
      },
      { root: null, rootMargin: "800px 0px", threshold: 0 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, fetchMore]);

  return (
    <>
      <ul className="grid gap-8 w-full min-w-0">
        {items.map((post, idx) => {
          const intro = post.intro?.trim() ?? "";

          return (
            <motion.li
              key={post._id}
              className="w-full min-w-0"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.2, once: true }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
                delay: Math.min(idx * 0.03, 0.15),
              }}
            >
              <article className="grid gap-5 sm:gap-6 grid-cols-1 xl:grid-cols-2 items-start w-full min-w-0">
                {/* Media col */}
                <Link
                  href={`/blog/${post.id}`}
                  className="group block w-full min-w-0"
                  aria-label={post.title}
                >
                  <div className="relative rounded-xl overflow-hidden bg-neutral-100 aspect-[16/10] w-full min-w-0">
                    {post.thumbnailUrl ? (
                      <Image
                        src={post.thumbnailUrl}
                        alt={
                          post.title
                            ? `Thumbnail for ${post.title}`
                            : "Post image"
                        }
                        fill
                        className="object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                        sizes="(min-width:1280px) 50vw, 100vw"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-100 to-stone-200" />
                    )}
                  </div>
                </Link>

                {/* Content col */}
                <Card className="h-full relative bg-primary overflow-hidden md:p-6 w-full min-w-0 shadow-none border-none">
                  {/* Meta */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    {post.date && (
                      <time dateTime={new Date(post.date).toISOString()}>
                        {new Date(post.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </time>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="mt-1 font-lora text-xl md:text-2xl leading-snug">
                    <Link
                      href={`/blog/${post.id}`}
                      className="underline-offset-4 decoration-transparent hover:underline focus-visible:underline focus-visible:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {/* Excerpt */}
                  {intro && (
                    <CardDescription className="mt-3 text-sm md:text-base text-gray-700 leading-relaxed">
                      {intro}
                    </CardDescription>
                  )}

                  {/* Tags */}
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <ul className="mt-4 flex font-poppins flex-wrap gap-2">
                      {post.tags.slice(0, 5).map((tag) => (
                        <li key={tag}>
                          <span className="rounded-full flex justify-center bg-secondary text-black px-2.5 py-1 text-xs font-medium">
                            {tag}
                          </span>
                        </li>
                      ))}
                      {post.tags.length > 5 && (
                        <li>
                          <span className="rounded-full flex justify-center bg-secondary text-black px-2.5 py-1 text-xs font-medium">
                            +{post.tags.length - 5} more
                          </span>
                        </li>
                      )}
                    </ul>
                  )}

                  {/* CTA */}
                  <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-sm font-medium underline underline-offset-4 hover:no-underline"
                      aria-label={`Read ${post.title}`}
                    >
                      Read post →
                    </Link>
                  </div>
                </Card>
              </article>

              <Separator className="my-6 md:my-8 bg-secondary" />
            </motion.li>
          );
        })}
      </ul>

      {/* Sentinel */}
      <div
        ref={sentinelRef}
        className="h-12 w-full flex items-center justify-center"
      >
        {loading && (
          <span className="text-sm text-muted-foreground">Loading more…</span>
        )}
        {!hasMore && (
          <span className="text-xs text-muted-foreground">
            You’ve reached the end.
          </span>
        )}
      </div>
    </>
  );
}
