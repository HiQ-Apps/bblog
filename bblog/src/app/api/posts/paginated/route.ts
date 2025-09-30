import { getAllPostsPaginated } from "@/queries/Post";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const end = Number(url.searchParams.get("end") ?? 10);
  const items = await getAllPostsPaginated(offset, end);
  return Response.json(items, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=600",
    },
  });
}
