"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { type ReactNode } from "react";
import Image from "next/image";

export type BlogCardProps = {
  title: string;
  body: ReactNode;
  coverImageUrl: string;
};

const BlogCard = ({ title, body, coverImageUrl }: BlogCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full hover:bg-gray-200">
      <CardContent className="space-y-2 flex flex-col w-full items-center justify-center">
        <Image
          src={coverImageUrl}
          alt={title}
          width={1600}
          height={900}
          className="w-full h-auto object-cover rounded-md"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
        />
        <CardHeader className="font-lora w-full px-0 mb-0">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription className="font-mont w-full">{body}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
