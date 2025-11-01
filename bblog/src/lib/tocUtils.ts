// lib/tocUtils.ts
import type { TocItem } from "@/components/composite/tableOfContents";

/**
 * Extracts headings (h2, h3) from Portable Text content
 * and generates TOC items with proper IDs
 */
export function extractTocFromPortableText(content: any[]): TocItem[] {
  if (!content?.length) return [];

  const items: TocItem[] = [];

  content.forEach((block) => {
    // Only process block-type content with h2 or h3 styles
    if (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    ) {
      // Extract plain text from children
      const text = block.children
        ?.map((child: any) => child.text)
        .join("")
        .trim();

      if (text) {
        // Generate URL-safe ID from text
        const id = generateHeadingId(text);
        items.push({
          id,
          text,
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  });

  return items;
}

/**
 * Generates a URL-safe ID from heading text
 * Example: "Getting Started with React" -> "getting-started-with-react"
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}
