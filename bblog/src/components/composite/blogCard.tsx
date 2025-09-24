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
      <CardContent className="space-y-2 justify-cente">
        <Image src={coverImageUrl} alt={title} width={400} height={200} />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription>{body}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
