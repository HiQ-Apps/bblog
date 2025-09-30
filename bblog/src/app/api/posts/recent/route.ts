// src/app/api/posts/recent/route.ts
import { NextRequest } from "next/server";
import { getMostRecentPosts } from "@/queries/Post";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 6);
  const items = await getMostRecentPosts(limit);
  return Response.json(items, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=600",
    },
  });
}
