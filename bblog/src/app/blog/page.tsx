import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { sanityFetch } from "@/sanity/the-good-standard/lib/live";
import Image from "next/image";
import { allPostPaginatedQuery } from "@/lib/queries";
import { type PostCard } from "@/types/Post";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {} from "@/queries/Post";

export const revalidate = 120;

type Paginated = { items: PostCard[]; total: number };

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const PAGE_SIZE = 8;
  const page = Math.max(1, Number(searchParams?.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;
  const end = offset + PAGE_SIZE - 1;

  const { data } = await sanityFetch({
    query: allPostPaginatedQuery,
    params: { offset, end },
  });
  const posts = data.items;
  const total = data.total;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageHref = (p: number) => `/blog${p > 1 ? `?page=${p}` : ""}`;

  return (
    <div className="w-full mx-auto p-6">
      <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post: PostCard) => (
          <li key={post._id}>
            <Link href={`/blog/${post.id}`} className="no-underline">
              <Card className="flex justify-center items-center border-b pb-6 hover:shadow-lg transition-shadow hover:bg-gray-200">
                <div className="text-2xl font-lora font-semibold">
                  <h1 className="mx-8 transition-transform hover:-translate-y-0.5 inline-block">
                    {post.title}
                  </h1>
                </div>

                <CardContent className="flex flex-col justify-center items-center ">
                  {post.thumbnailUrl && (
                    <Image
                      src={post.thumbnailUrl}
                      alt={`Thumbnail for ${post.title}`}
                      width={1200}
                      height={630}
                    />
                  )}

                  <CardDescription className="w-full">
                    {post.date && (
                      <p className="mt-2 text-gray-500 font-mont text-xs">
                        Published on {new Date(post.date).toLocaleDateString()}
                      </p>
                    )}
                    {post.intro && (
                      <p className="mt-2 text-gray-700 font-mont">
                        {post.intro.length > 100
                          ? `${post.intro.slice(0, 100)}…`
                          : post.intro}
                      </p>
                    )}
                  </CardDescription>

                  <CardFooter className="w-full flex justify-start px-0">
                    <div className="mt-2 flex flex-row gap-2 items-center flex-wrap font-mont">
                      {/* {post.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-200 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))} */}
                      <p className="text-sm">Tags: </p>
                      <HoverCard>
                        <HoverCardTrigger>
                          <DotsHorizontalIcon />
                        </HoverCardTrigger>

                        <HoverCardContent className="w-72">
                          <ul className="list-none flex flex-wrap gap-2">
                            {post.tags?.map((tag: string) => (
                              <li key={tag}>
                                <span className="inline-flex items-center rounded bg-gray-200 px-2 py-1 text-xs">
                                  {tag}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </CardFooter>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination controls */}
      <nav className="mt-8 flex items-center justify-between">
        <Link
          href={hasPrev ? pageHref(page - 1) : "#"}
          aria-disabled={!hasPrev}
          className={`px-3 py-2 rounded border ${
            hasPrev
              ? "hover:bg-gray-100"
              : "opacity-50 pointer-events-none select-none"
          }`}
        >
          ← Previous
        </Link>

        <span className="text-sm text-gray-600">
          Page {page} of {totalPages} • {total} {total === 1 ? "post" : "posts"}
        </span>

        <Link
          href={hasNext ? pageHref(page + 1) : "#"}
          aria-disabled={!hasNext}
          className={`px-3 py-2 rounded border ${
            hasNext
              ? "hover:bg-gray-100"
              : "opacity-50 pointer-events-none select-none"
          }`}
        >
          Next →
        </Link>
      </nav>
    </div>
  );
}
