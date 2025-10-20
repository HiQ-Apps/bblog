import "server-only";

import { client, sanityFetch } from "@/sanity/the-good-standard/lib/live";
import {
  allPostPaginatedQuery,
  mostRecentPostsQuery,
  postBySlugQuery,
  allPostSlugsQuery,
  allTagsQuery,
  postsByTagQuery,
  postsByTagsQuery,
  postBySlugDraftQuery,
  postsRelatedByTagQuery,
  highlightedPostsQuery,
} from "@/lib/queries";
import { QueryParams } from "next-sanity";

export async function getPostBySlug(slug: string, isDraft = false) {
  if (isDraft) {
    const data = await client.fetch(postBySlugDraftQuery, { slug });
    return data;
  }

  const { data } = await sanityFetch({
    query: postBySlugQuery,
    stega: false,
    params: { slug },
  });

  return data;
}

export async function getMostRecentPosts(limit = 6) {
  const { data } = await sanityFetch({
    query: mostRecentPostsQuery,
    perspective: "published",
    stega: false,
    params: { limit },
  });
  return data;
}

export async function getAllPostsPaginated(offset: number, limit: number) {
  const end = offset + limit;
  const { data } = await sanityFetch({
    query: allPostPaginatedQuery,
    perspective: "published",
    stega: false,
    params: { offset, end },
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data as { items: any[]; total: number };
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const params = { tag, offset, end: offset + limit } as any;
  const { data } = await sanityFetch({
    query: postsByTagQuery,
    params,
    perspective: "published",
    stega: false,
  });
  return data;
}

export async function getPostsRelatedByTags(
  tags: string[],
  limit = 6,
  currentSlug?: string | null
) {
  const excludeSlugs = currentSlug ? [currentSlug] : [];
  const fetchLimit = limit + 1;

  const { data: fetched } = await sanityFetch({
    query: postsRelatedByTagQuery,
    params: { tags, excludeSlugs, fetchLimit },
    perspective: "published",
    stega: false,
  });

  const items = (fetched ?? []).slice(0, limit);
  const hasMore = (fetched ?? []).length > limit;

  return { items, hasMore };
}

export async function getPostsByTags(
  tags: string[],
  mode: "or" | "and" = "or",
  offset = 0,
  limit = 24
) {
  if (!tags.length) return [];

  const params: QueryParams = {
    tags,
    requireAll: mode === "and",
    offset,
    end: offset + limit,
  };

  const { data } = await sanityFetch({
    query: postsByTagsQuery,
    params,
    perspective: "published",
    stega: false,
  });

  return data;
}

export async function getHighlightedPosts() {
  const { data } = await sanityFetch({
    query: highlightedPostsQuery,
    perspective: "published",
    stega: false,
  });
  return data;
}
