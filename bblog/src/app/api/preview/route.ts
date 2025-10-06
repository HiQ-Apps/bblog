// app/api/preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) return new NextResponse("Missing slug", { status: 400 });

  const draft = await draftMode();
  draft.enable();

  return redirect(`/blog/${encodeURIComponent(slug)}`);
}
