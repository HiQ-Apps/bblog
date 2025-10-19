"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  type Variants,
  useInView,
  useReducedMotion,
} from "framer-motion";
import type { PostResponse } from "@/types/Post";
import BlogCard from "./blogCard";
import Link from "next/link";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const parent: Variants = {
  hidden: { opacity: 0 },
  visible: (prefersReducedMotion: boolean) => ({
    opacity: 1,
    transition: prefersReducedMotion
      ? { duration: 0.2 }
      : { delayChildren: 0.05, staggerChildren: 0.12 },
  }),
};

const child: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (prefersReducedMotion: boolean) => ({
    opacity: 1,
    y: 0,
    transition: prefersReducedMotion
      ? { duration: 0.2 }
      : { duration: 0.6, ease: EASE },
  }),
};

export default function HighlightedCarousel() {
  const [highlightedPosts, setHighlightedPosts] = useState<PostResponse[]>([]);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const fetchHighlightedPosts = async () => {
      const response = await fetch("/api/posts/highlighted");
      const data = await response.json();
      setHighlightedPosts(data);
    };
    fetchHighlightedPosts();
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-h-lg">
      <motion.h1
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { duration: 0.7, ease: EASE }
        }
        className="font-lora text-4xl px-8 mb-4"
      >
        Popular
      </motion.h1>

      <Carousel className="w-full">
        {/* Track */}
        <CarouselContent className="-ml-2">
          {/* Stagger container */}
          <motion.div
            variants={parent}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            custom={prefersReducedMotion}
            className="contents"
          >
            {highlightedPosts.map((post) => (
              <CarouselItem
                key={post.slug}
                className="
                  pl-2
                  basis-full
                  lg:basis-full
                  xl:basis-1/2
                  flex justify-center
                "
              >
                <motion.div
                  variants={child}
                  custom={prefersReducedMotion}
                  whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 0.25, ease: EASE }
                  }
                  className="mx-auto w-full max-w-[820px]"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block no-underline"
                  >
                    <BlogCard
                      title={post.title}
                      body={
                        post.preview?.split(" ").slice(0, 20).join(" ") + "…"
                      }
                      coverImageUrl={
                        post.heroImage?.asset?.url || "/placeholder.png"
                      }
                      sizeClass="aspect-[16/9]"
                    />
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </motion.div>
        </CarouselContent>

        {/* Controls */}
        <div className="w-full flex justify-center mt-4 gap-3">
          <CarouselPrevious
            className="static translate-x-0 translate-y-0 rotate-0
                     h-11 px-5 rounded-full border border-secondary bg-secondary/40 backdrop-blur
                     shadow-md hover:shadow-lg transition disabled:opacity-50"
            size="default"
            variant="outline"
          />
          <CarouselNext
            className="static translate-x-0 translate-y-0 rotate-0
                     h-11 px-5 rounded-full border border-secondary bg-secondary/40 backdrop-blur
                     shadow-md hover:shadow-lg transition disabled:opacity-50"
            size="default"
            variant="outline"
          />
        </div>
      </Carousel>
    </section>
  );
}
