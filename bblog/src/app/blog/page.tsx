import Link from "next/link";
import { POSTS } from "@/data/posts";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";

export default function BlogPage() {
  return (
    <div className="w-full mx-auto p-6">
      <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-4">
        {POSTS.map((post) => (
          <Link
            href={`/blog/${post.id}`}
            key={post.id}
            className="no-underline"
          >
            <Card
              key={post.id}
              className="flex justify-center items-center border-b pb-6"
            >
              <div className="text-2xl font-lora font-semibold">
                <h1 className="mx-8 transition-transform hover:-translate-y-0.5 inline-block">
                  {post.title}
                </h1>
              </div>
              <CardContent className="flex flex-col justify-center items-center ">
                <Image
                  src={post.thumbnailUrl as string}
                  alt={`Thumbnail for ${post.title}`}
                  width={500}
                  height={100}
                />
                <CardDescription>
                  <p className="text-gray-500 font-mont">{post.date}</p>
                  <p className="mt-2 text-gray-700 font-mont">
                    {post.intro.slice(0, 100)}...
                  </p>
                </CardDescription>
                <CardFooter>
                  <div className="mt-2 flex gap-2 flex-wrap font-mont">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-200 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardFooter>
              </CardContent>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}
