import "server-only";

import { sanityFetch } from "@/sanity/the-good-standard/lib/live";
import {
  allPostPaginatedQuery,
  mostRecentPostsQuery,
  postBySlugQuery,
  allPostSlugsQuery,
  allTagsQuery,
  postsByTagQuery,
  postsByTagsQuery,
} from "@/lib/queries";
import { PostCard } from "@/types/Post";
import { QueryParams } from "next-sanity";

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

export async function getAllTags() {
  const { data } = await sanityFetch({
    query: allTagsQuery,
    perspective: "published",
    stega: false,
  });
  return data as string[];
}

// Helper to get all tags with their counts
export async function getAllTagsWithCount() {
  const posts = await getAllPostSlugs();
  const tagCount: Record<string, number> = {};
  for (const post of posts) {
    const fullPost = await getPostBySlug(post.slug);
    if (fullPost?.tags && Array.isArray(fullPost.tags)) {
      for (const tag of fullPost.tags) {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      }
    }
  }
  return tagCount;
}

export async function getPostsByTag(tag: string, offset = 0, limit = 24) {
  const params = { tag, offset, end: offset + limit } as any;
  const { data } = await sanityFetch({
    query: postsByTagQuery,
    params,
    perspective: "published",
    stega: false,
  });
  return data;
}

export async function getPostsByTags(
  tags: string[],
  mode: "or" | "and" = "or",
  offset = 0,
  limit = 24
) {
  if (!tags.length) return [];

  const params: QueryParams = {
    tags, // ← array of strings
    requireAll: mode === "and", // ← boolean switch
    offset,
    end: offset + limit,
  };

  const { data } = await sanityFetch({
    query: postsByTagsQuery,
    params,
  });

  return data;
}
