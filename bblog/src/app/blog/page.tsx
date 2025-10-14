import "server-only";
import Link from "next/link";
import { Card, CardDescription } from "@/components/ui/card";
import Image from "next/image";
import { type PostCard } from "@/types/Post";
import { notFound } from "next/navigation";
import { getAllPostsPaginated } from "@/queries/Post";
import HorizontalAd from "@/components/composite/horizontalAd";

export const dynamic = "force-dynamic";

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
      <ul className="list-none grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
        {items.map((post: PostCard) => (
          <li key={post._id} className="min-w-0">
            <Card className="py-0 w-full my-0 min-w-0 overflow-hidden hover:shadow-xl transition-shadow">
              <Link
                href={`/blog/${post.id}`}
                className="group block w-full min-w-0"
              >
                <div className="relative w-full min-w-0 h-72 xl:h-80 2xl:h-96 rounded-md overflow-hidden">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={`Thumbnail for ${post.title}`}
                      fill
                      className="object-cover transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform group-hover:scale-105"
                      sizes="(min-width:1536px) 33vw, (min-width:1280px) 50vw, 100vw"
                      priority={false}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute inset-0 grid place-items-center p-8">
                    <div className="inline-flex max-w-[min(65ch,100%)] flex-col items-center gap-2 rounded-xl bg-white/70 backdrop-blur-sm px-4 py-3 md:px-6 md:py-4 shadow-md text-center">
                      <h2 className="font-lora text-lg md:text-xl leading-tight">
                        {post.title}
                      </h2>

                      <CardDescription className="font-mont text-black/80">
                        {post.date && (
                          <p className="mt-1 text-xs text-gray-600">
                            Published on{" "}
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        )}
                        {post.intro && (
                          <p className="mt-2">
                            {post.intro.length > 120
                              ? `${post.intro.split(" ").slice(0, 10).join(" ")}…`
                              : post.intro}
                          </p>
                        )}
                      </CardDescription>

                      {post.tags?.length ? (
                        <ul className="mt-2 flex flex-wrap justify-center gap-2">
                          {post.tags.slice(0, 8).map((tag: string) => (
                            <li key={tag}>
                              <span className="inline-flex items-center rounded-full bg-gray-900/80 text-white px-2.5 py-0.5 text-[11px] leading-5">
                                {tag}
                              </span>
                            </li>
                          ))}
                          {post.tags.length > 8 && (
                            <li>
                              <span className="inline-flex items-center rounded-full bg-gray-300 text-gray-800 px-2.5 py-0.5 text-[11px] leading-5">
                                +{post.tags.length - 8} more
                              </span>
                            </li>
                          )}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Link>
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
      <HorizontalAd className="my-8" />
    </div>
  );
}
