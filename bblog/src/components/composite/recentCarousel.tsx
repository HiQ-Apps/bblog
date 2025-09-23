"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { POSTS } from "@/data/posts";
import Autoplay from "embla-carousel-autoplay";

import BlogCard from "./blogCard";

const RecentCarousel = () => {
  return (
    <div className="w-full h-auto mb-4 ">
      <h2 className="font-lora text-4xl px-8 mb-4">Recent Posts</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 7000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {POSTS.map((post) => (
            <CarouselItem
              key={post.id}
              className="md:mx-2 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <BlogCard
                title={post.title}
                body={post.intro.slice(0, 100) + "..."}
                coverImageUrl={post.thumbnailUrl as string}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="rounded-none border-none" />
        <CarouselPrevious className="rounded-none border-none" />
      </Carousel>
    </div>
  );
};

export default RecentCarousel;
