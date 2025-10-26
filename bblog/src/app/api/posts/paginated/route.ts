// app/api/posts/paginated/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllPostsPaginated } from "@/queries/Post";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const offset = Math.max(0, Number(searchParams.get("offset") ?? "0"));
  const limitRaw = Number(searchParams.get("limit") ?? "12");
  const limit = Math.max(1, Math.min(50, isNaN(limitRaw) ? 12 : limitRaw));

  const { items, total } = await getAllPostsPaginated(offset, limit);
  return NextResponse.json(
    { items, total },
    {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=600" },
    }
  );
}
