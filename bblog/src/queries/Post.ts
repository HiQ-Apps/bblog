import "server-only";

import { sanityFetch } from "@/sanity/the-good-standard/lib/live";
import {
  mostRecentPostsQuery,
  allPostPaginatedQuery,
  postBySlugQuery,
} from "@/lib/queries";

const getMostRecentPosts = async (limit = 6) => {
  const safeLimit = Math.min(Math.max(1, limit), 9);
  const { data } = await sanityFetch({
    query: mostRecentPostsQuery,
    params: { limit: safeLimit },
    perspective: "published",
    stega: false,
  });
  return data;
};

const getAllPostsPaginated = async (offset: number, end: number) => {
  const { data } = await sanityFetch({
    query: allPostPaginatedQuery,
    params: { offset, end },
  });
  return data;
};

const getPostBySlug = async (slug: string) => {
  const { data } = await sanityFetch({
    query: postBySlugQuery,
    params: { slug },
  });
  return data;
};

export { getMostRecentPosts, getAllPostsPaginated, getPostBySlug };
