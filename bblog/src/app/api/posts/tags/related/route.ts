import { NextResponse } from "next/server";
import { getPostsRelatedByTags } from "@/queries/Post";
import { parseTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tags = parseTags(url);
    if (tags.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Provide ?tags=tag1,tag2" },
        { status: 400 }
      );
    }

    const currentSlug = url.searchParams.get("currentSlug");

    const limitRaw = Number(url.searchParams.get("limit") ?? 6);
    const limit = Math.min(Math.max(1, isNaN(limitRaw) ? 6 : limitRaw), 24);

    const data = await getPostsRelatedByTags(tags, limit, currentSlug || "");
    return NextResponse.json({ ok: true, ...data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
