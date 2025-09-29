"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BlogCard from "./blogCard";
import type { PostCard } from "@/types/Post";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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

  // Create the plugin instance once
  const autoplay = useRef(
    Autoplay({ delay: 8000, playOnInit: true, stopOnInteraction: false })
  );

  const [posts, setPosts] = useState<PostCard[]>([]);
  useEffect(() => {
    let alive = true;
    fetch(`/api/posts?limit=${limit}`)
      .then((r) => r.json())
      .then((data: PostCard[]) => {
        if (alive) setPosts(data);
      })
      .catch(() => {
        if (alive) setPosts([]);
      });
    return () => {
      alive = false;
    };
  }, [limit]);

  const enableAuto = heroReady && inView; // only autoplay when hero is ready & section in view

  return (
    <section ref={sectionRef} className="w-full h-auto mb-4">
      <motion.h2
        initial={{ opacity: 0, y: 48 }}
        animate={enableAuto ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-lora text-4xl px-8 mb-4"
      >
        Recent Posts
      </motion.h2>

      <motion.div
        variants={parent}
        initial="hidden"
        animate={enableAuto ? "visible" : "hidden"}
      >
        <Carousel
          key={enableAuto ? "auto" : "manual"} // force re-init when toggling plugin
          opts={{ align: "start", loop: true }}
          plugins={enableAuto ? [autoplay.current] : []} // mount plugin only when ready/in-view
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {posts.map((post) => (
              <CarouselItem
                key={post._id}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div variants={child} whileHover={{ y: -4 }}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="no-underline block"
                  >
                    <BlogCard
                      title={post.title}
                      body={
                        <div>
                          <p className="text-xs">
                            Published on{" "}
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                          {(post.intro ?? "").split(" ").slice(0, 7).join(" ") +
                            "..."}
                        </div>
                      }
                      coverImageUrl={post.thumbnailUrl ?? ""}
                    />
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 rounded-none border-none" />
          <CarouselNext className="right-2 top-1/2 -translate-y-1/2 rounded-none border-none" />
        </Carousel>
      </motion.div>
    </section>
  );
}
