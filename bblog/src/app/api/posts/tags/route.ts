import { NextResponse } from "next/server";
import { getPostsByTags } from "@/queries/Post";
import { parseTags } from "@/lib/utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tags = parseTags(url);
  if (tags.length === 0) {
    return NextResponse.json(
      { error: "Provide ?tags=tag1,tag2" },
      { status: 400 }
    );
  }

  const modeParam = (url.searchParams.get("mode") ?? "or").toLowerCase();
  const mode: "or" | "and" = modeParam === "and" ? "and" : "or";

  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));
  const limitRaw = Number(url.searchParams.get("limit") ?? 24);
  const limit = Math.min(Math.max(1, isNaN(limitRaw) ? 24 : limitRaw), 100);

  const data = await getPostsByTags(tags, mode, offset, limit);

  return NextResponse.json(data);
}
