// src/app/api/posts/by-slug/[slug]/route.ts
import { NextRequest } from "next/server";
import { getPostBySlug } from "@/queries/Post";
import { draftMode } from "next/headers";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const { isEnabled } = await draftMode();

  const post = await getPostBySlug(slug, isEnabled);
  if (!post) return new Response("Not found", { status: 404 });

  return Response.json(post, {
    headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=600" },
  });
}
