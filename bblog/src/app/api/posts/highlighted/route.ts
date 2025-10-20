import { NextResponse } from "next/server";
import { getHighlightedPosts } from "@/queries/Post";

export const dynamic = "force-dynamic";

export async function GET() {
  const highlightedPosts = await getHighlightedPosts();
  return NextResponse.json(highlightedPosts);
}
