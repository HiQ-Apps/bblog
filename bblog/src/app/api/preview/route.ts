// app/api/preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return new NextResponse("Missing slug", { status: 400 });

  (await draftMode()).enable();

  // Redirect to the slug route (no query param)
  return NextResponse.redirect(
    new URL(`/post/${encodeURIComponent(slug)}`, req.nextUrl)
  );
}
