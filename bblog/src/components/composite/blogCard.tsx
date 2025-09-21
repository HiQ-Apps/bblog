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
    <Card>
      <CardContent>
        <Image
          src={coverImageUrl}
          alt={title}
          layout="responsive"
          width={100}
          height={100}
        />
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardDescription>{body}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
