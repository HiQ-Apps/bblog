import "server-only";
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
import Image from "next/image";
import { type PostCard } from "@/types/Post";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { baseUrl } from "@/sanity/env";
import { notFound } from "next/navigation";
import customFetch from "@/utils/fetch";
import { getAllPostsPaginated } from "@/queries/Post";

const revalidate = 120;

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const PAGE_SIZE = 8;

  const params = (await searchParams) ?? {};
  const rawPage = params.page;
  const page = Math.max(1, Number(rawPage ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  const { items, total } = await getAllPostsPaginated(offset, PAGE_SIZE);
  if (!items) return notFound();

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageHref = (p: number) => `/blog${p > 1 ? `?page=${p}` : ""}`;

  return (
    <div className="w-full mx-auto p-6">
      <ul className="list-none grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((post: PostCard) => (
          <li key={post._id}>
            <Card className="flex items-center border-b pb-6 hover:shadow-lg transition-shadow hover:bg-gray-200">
              {/* Left: everything that navigates */}
              <Link
                href={`/blog/${post.id}`}
                className="no-underline flex-1 flex flex-col items-center"
              >
                <div className="text-2xl font-lora font-semibold">
                  <h1 className="mx-8 transition-transform hover:-translate-y-0.5 inline-block">
                    {post.title}
                  </h1>
                </div>

                <CardContent className="flex flex-col justify-center items-center">
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
                </CardContent>
              </Link>

              {/* Right: NON-link controls (separate from the anchor) */}
              <CardFooter className="flex justify-end w-full">
                <div className="mt-2 flex flex-row gap-2 items-center w-full font-mont">
                  <p className="text-sm">Tags:</p>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      {/* Use a button to avoid anchors inside anchors */}
                      <button
                        type="button"
                        aria-label="Show tags"
                        className="inline-flex hover:pointer hover:bg-secondary px-2 py-1 rounded-sm"
                      >
                        <DotsHorizontalIcon />
                      </button>
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
            </Card>
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
