"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import BlogCard from "./blogCard";
import type { PostCard } from "@/types/Post";

const EASE = [0.22, 1, 0.36, 1] as const;

const parent: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.05, staggerChildren: 0.12 },
  },
};
const child: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export default function RecentPostsCarousel({
  heroReady,
  limit = 6,
}: {
  heroReady: boolean;
  limit?: number;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [posts, setPosts] = useState<PostCard[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/recent?limit=${limit}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PostCard[] = await res.json();
        setPosts(data);
      } catch (err: any) {
        if (err?.name !== "AbortError")
          console.error("fetch recent posts:", err);
      } finally {
        setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [limit]);

  // 🔧 Re-init after content changes so Embla recalculates slide sizes
  useEffect(() => {
    if (!api) return;
    api.reInit();
  }, [api, posts.length]);

  // Simple autoplay (unchanged)
  useEffect(() => {
    if (!api) return;

    const enabled = heroReady && inView;
    let paused = false;
    let id: number | undefined;

    const tick = () => {
      if (paused || !enabled) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    };

    const onPointerDown = () => {
      paused = true;
    };
    const onPointerUp = () => {
      paused = false;
    };

    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    if (enabled) id = window.setInterval(tick, 8000);

    return () => {
      if (id) window.clearInterval(id);
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
    };
  }, [api, heroReady, inView]);

  return (
    <section ref={sectionRef} className="w-full h-auto mb-4">
      <motion.h2
        initial={{ opacity: 0, y: 48 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-lora text-4xl px-8 mb-4"
      >
        Recent Posts
      </motion.h2>

      <motion.div
        variants={parent}
        initial="hidden"
        animate={posts.length ? "visible" : "hidden"}
      >
        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: true }}
          className="w-full will-change-transform"
        >
          <CarouselContent className="-ml-4">
            {(loading ? Array.from({ length: Math.min(3, limit) }) : posts).map(
              (post, i) => (
                <CarouselItem
                  key={loading ? `skeleton-${i}` : (post as PostCard)._id}
                  // ✅ ensure slides don't overflow & widths apply
                  className="min-w-0 shrink-0 pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <motion.div variants={child} whileHover={{ y: -4 }}>
                    {loading ? (
                      <div className="h-48 rounded-lg bg-gray-200 animate-pulse" />
                    ) : (
                      <Link
                        href={`/blog/${(post as PostCard).id}`}
                        className="no-underline block"
                      >
                        <BlogCard
                          title={(post as PostCard).title}
                          body={
                            <div>
                              <p className="text-xs">
                                Published on{" "}
                                {new Date(
                                  (post as PostCard).date
                                ).toLocaleDateString()}
                              </p>
                              {((post as PostCard).intro ?? "")
                                .split(" ")
                                .slice(0, 7)
                                .join(" ") + "..."}
                            </div>
                          }
                          coverImageUrl={(post as PostCard).thumbnailUrl ?? ""}
                        />
                      </Link>
                    )}
                  </motion.div>
                </CarouselItem>
              )
            )}
          </CarouselContent>

          <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 rounded-none border-none" />
          <CarouselNext className="right-2 top-1/2 -translate-y-1/2 rounded-none border-none" />
        </Carousel>
      </motion.div>
    </section>
  );
}
