import { POSTS, type Post } from "@/data/posts";

export function getAllPosts(): Post[] {
  // sort newest first
  return [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
export function getPostById(id: string): Post | undefined {
  return POSTS.find((p) => p.id === id);
}
export function searchPosts(q: string): Post[] {
  const s = q.trim().toLowerCase();
  if (!s) return getAllPosts();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(s) ||
      p.intro.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s))
  );
}
