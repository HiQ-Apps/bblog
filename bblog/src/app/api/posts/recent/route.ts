// src/app/api/posts/recent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getMostRecentPosts } from "@/queries/Post";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? 6);
  const items = await getMostRecentPosts(limit);
  return NextResponse.json(items, {
    headers: { "Cache-Control": "no-store" },
  });
}
