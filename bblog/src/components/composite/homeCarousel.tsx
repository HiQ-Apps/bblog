"use client";

import { useEffect, useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { POSTS } from "@/data/posts";
import BlogCard from "./blogCard";

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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.2, ease: EASE },
  },
};

export default function HomeCarousel({ heroReady }: { heroReady: boolean }) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.4 });
  const autoplay = useRef(Autoplay({ delay: 8000, playOnInit: false }));

  return (
    <section ref={sectionRef} className="w-full h-auto mb-4">
      <motion.h2
        initial={{ opacity: 0, y: 48 }}
        animate={
          heroReady && inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }
        }
        transition={{ duration: 0.7, ease: EASE }}
        className="font-lora text-4xl px-8 mb-4"
      >
        Recent Posts
      </motion.h2>

      <motion.div
        variants={parent}
        initial="hidden"
        animate={heroReady && inView ? "visible" : "hidden"}
      >
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {POSTS.map((post) => (
              <CarouselItem
                key={post.id}
                className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <motion.div variants={child} whileHover={{ y: -4 }}>
                  <Link
                    href={`/blog/${post.id}`}
                    className="no-underline block"
                  >
                    <BlogCard
                      title={post.title}
                      body={post.intro.slice(0, 100) + "..."}
                      coverImageUrl={post.thumbnailUrl as string}
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
