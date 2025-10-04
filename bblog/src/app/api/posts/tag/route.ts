import { NextResponse } from "next/server";
import { getPostsByTag } from "@/queries/Post";

export default async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get("tag");
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 24;

  if (!tag) {
    return NextResponse.json(
      { error: "Missing tag parameter" },
      { status: 400 }
    );
  }
  const data = await getPostsByTag(tag, offset, limit);

  if (!data) {
    return NextResponse.json(
      { error: "No posts found for the given tag" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
