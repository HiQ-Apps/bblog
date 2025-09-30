"use client";

import Image from "next/image";
import { type ReactNode } from "react";

export type BlogCardProps = {
  title: string;
  body: ReactNode;
  coverImageUrl: string;
  sizeClass?: string;
  boxClass?: string;
};

const BlogCard = ({
  title,
  body,
  coverImageUrl,
  sizeClass = "aspect-[16/9]",
  boxClass = "bg-white/80 backdrop-blur-sm",
}: BlogCardProps) => {
  return (
    <div
      className={`group relative w-full min-w-0 overflow-hidden rounded-xl shadow-2xl ${sizeClass}`}
    >
      <Image
        src={coverImageUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105"
        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        priority={false}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 z-10 grid place-items-center p-4">
        <div
          className={`inline-flex flex-col items-center gap-2 rounded-xl px-4 py-3 md:px-6 md:py-4 shadow-md
                      max-w-[min(65ch,100%)] break-words text-center transition-transform duration-300 ${boxClass}`}
        >
          <h3 className="font-lora text-lg md:text-xl leading-tight">
            {title}
          </h3>
          <div className="font-mont text-sm text-black/80">{body}</div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
