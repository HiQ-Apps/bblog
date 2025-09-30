import "server-only";

import { sanityFetch } from "@/sanity/the-good-standard/lib/live";
import {
  allPostPaginatedQuery,
  mostRecentPostsQuery,
  postBySlugQuery,
  allPostSlugsQuery,
} from "@/lib/queries";
import { PostCard } from "@/types/Post";

export async function getMostRecentPosts(limit = 6) {
  const safeLimit = Math.min(Math.max(1, limit), 50);
  const { data } = await sanityFetch({
    query: mostRecentPostsQuery,
    params: { limit: safeLimit },
    perspective: "published",
    stega: false,
  });
  return data as PostCard[];
}

export async function getAllPostsPaginated(offset: number, limit: number) {
  const end = offset + limit;
  const { data } = await sanityFetch({
    query: allPostPaginatedQuery,
    perspective: "published",
    stega: false,
    params: { offset, end },
  });
  // data = { items, total }
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data as { items: any[]; total: number };
}

export async function getPostBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: postBySlugQuery,
    perspective: "published",
    stega: false,
    params: { slug },
  });
  return data;
}

export async function getAllPostSlugs() {
  const { data } = await sanityFetch({
    query: allPostSlugsQuery,
    perspective: "published",
    stega: false,
  });
  return data as { slug: string; updatedAt?: string }[];
}
