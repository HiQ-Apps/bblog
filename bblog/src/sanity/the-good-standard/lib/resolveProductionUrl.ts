import type { SanityDocument } from "sanity";

interface PostDoc extends SanityDocument {
  slug?: { current?: string };
}

export default function resolveProductionUrl(
  doc: SanityDocument
): string | undefined {
  if (doc._type !== "post") return undefined;

  const slug = (doc as PostDoc).slug?.current;
  if (!slug) return undefined;

  const baseUrl =
    process.env.NEXT_PUBLIC_PREVIEW_URL || "https://thegoodstandard.org";
  const url = new URL("/api/preview", baseUrl);
  url.searchParams.set("slug", slug);

  return url.toString();
}
