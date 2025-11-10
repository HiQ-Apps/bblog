// app/post/[id]/page.tsx
import { notFound } from "next/navigation";
import { client } from "@/sanity/the-good-standard/lib/live";
import { postBySlugDraftQuery, postBySlugQuery } from "@/lib/queries";
import Image from "next/image";
import DiscountCodes from "@/components/composite/discountCodes";
import type { Metadata } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import PreviewPdf from "@/components/composite/previewPdf";
import Disclosure from "@/components/composite/disclosureCard";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";
import { draftMode } from "next/headers";
import AmazonProductCard from "@/components/composite/amazonProductCard";
import HorizontalAd from "@/components/composite/horizontalAd";
import ProductCard, {
  GenericProduct,
} from "@/components/composite/productCard";
import RelevantList from "@/components/composite/relevantList";
import TableOfContents, {
  type TocItem,
} from "@/components/composite/tableOfContents";
import { Separator } from "@/components/ui/separator";

export const revalidate = 120;

async function fetchPostSSR(slug: string) {
  const { isEnabled } = await draftMode();
  return client.fetch(
    isEnabled ? postBySlugDraftQuery : postBySlugQuery,
    { slug },
    isEnabled ? { cache: "no-store" } : { next: { revalidate } }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostSSR(slug);
  if (!post) return {};

  const title = post.seoTitle?.trim() || post.title;
  const description =
    post.seoDescription?.trim() || post.preview?.trim() || DEFAULT_DESCRIPTION;

  const ogImage =
    post.ogImage?.url ||
    post.heroImage?.asset?.url ||
    post.thumbnailUrl ||
    DEFAULT_OG_IMAGE;

  const canonicalPath = post.canonicalUrl
    ? new URL(post.canonicalUrl).pathname
    : `/blog/${(await params).slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      url: canonicalPath,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Helper: Generate URL-safe ID from heading text
function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

// Helper: Extract text content from PortableText children
function extractTextFromChildren(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (children?.props?.children) {
    return extractTextFromChildren(children.props.children);
  }
  return "";
}

function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  }
}

// Helper: Extract TOC items from Portable Text content
function extractTocItems(content: any[]): TocItem[] {
  if (!content?.length) return [];

  const items: TocItem[] = [];

  content.forEach((block) => {
    if (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    ) {
      const text = block.children
        ?.map((child: any) => child.text)
        .join("")
        .trim();

      if (text) {
        items.push({
          id: generateHeadingId(text),
          text,
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  });

  return items;
}

// Create PortableText components with TOC items injected
function createPtComponents(tocItems: TocItem[]): PortableTextComponents {
  return {
    marks: {
      link: ({ children, value }) => {
        const rel = value?.nofollow ? "nofollow sponsored" : "noopener";
        return (
          <a
            className="text-mont text-accent underline underline-accent"
            href={value?.href}
            target="_blank"
            rel={rel}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset?.url) return null;

        const alt = value?.alt || "";
        const metaW = value?.asset?.metadata?.dimensions?.width;
        const metaH = value?.asset?.metadata?.dimensions?.height;
        const setW = typeof value?.width === "number" ? value.width : undefined;
        const setH =
          typeof value?.height === "number" ? value.height : undefined;

        const w = setW ?? metaW ?? 1200;
        const h =
          setH ?? (metaW && metaH ? Math.round(w * (metaH / metaW)) : 700);
        const url = value.asset.url;

        const img = (
          <Image
            src={url}
            alt={alt}
            width={w}
            height={h}
            className="rounded-lg mt-4 block mx-auto"
            sizes="(min-width: 1024px) 900px, 100vw"
            loading="lazy"
            decoding="async"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        );

        const figure = (
          <div className="my-4 w-full flex flex-col items-center">
            {img}
            {value.caption && (
              <p className="text-sm italic text-gray-500 mt-2 text-center">
                {value.caption}
              </p>
            )}
          </div>
        );

        return value?.link ? (
          <a href={value.link} target="_blank" rel="noopener">
            {figure}
          </a>
        ) : (
          figure
        );
      },
      amazonProduct: ({ value }) => <AmazonProductCard value={value} />,
      productCard: ({ value }) => {
        const gp: GenericProduct = {
          title: value?.productName ?? value?.image?.alt ?? "Product",
          url: value?.link ?? undefined,
          image: value?.image ?? null,
          description: value?.description ?? null,
          priceSnapshot: value.price,
          retailer: value?.retailer ?? null,
          features: value?.features ?? [],
        };
        return <ProductCard product={gp} />;
      },
      downloadGroup: ({ value }: any) => (
        <div className="my-4 flex flex-wrap justify-center gap-2">
          {value.items?.map((it: any) => (
            <PreviewPdf
              key={it._key}
              url={it.url}
              filename={it.filename ?? "download.pdf"}
              label={it.label ?? "Preview PDF"}
              className="cursor-pointer"
            />
          ))}
        </div>
      ),
      discountCode: ({ value }: any) => {
        if (!value || !Array.isArray(value)) return null;

        return (
          <div className="my-4 flex flex-wrap justify-center gap-2">
            {value.map((code: any) => (
              <div key={code._key} className="border p-2 rounded">
                <p className="font-bold">{code.code}</p>
                <p className="text-sm">{code.description}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    block: {
      normal: ({ children }) => (
        <p className="font-poppins text-lg/8 my-4">{children}</p>
      ),
      h1: ({ children }) => {
        const text = extractTextFromChildren(children);
        const id = generateHeadingId(text);
        return (
          <h1
            id={id}
            className="font-lora text-4xl font-bold mt-8 scroll-mt-20"
          >
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        const text = extractTextFromChildren(children);
        const id = generateHeadingId(text);
        return (
          <h2
            id={id}
            className="font-lora text-3xl font-bold mt-8 scroll-mt-20"
          >
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const text = extractTextFromChildren(children);
        const id = generateHeadingId(text);
        return (
          <h3
            id={id}
            className="font-lora text-2xl font-bold mt-6 scroll-mt-20"
          >
            {children}
          </h3>
        );
      },
      blockquote: ({ children }) => (
        <blockquote className="font-poppins text-xl border-l-4 pl-4 italic my-4">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc list-inside font-poppins text-lg/8 my-4">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal list-inside font-poppins text-lg/8 my-4">
          {children}
        </ol>
      ),
    },
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function View({ post }: { post: any }) {
  if (!post) return notFound();

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : (post.date ?? null);

  const heroUrl: string | null =
    post.heroImage?.asset?.url ?? post.thumbnailUrl ?? null;
  const heroDescription = post.heroImage?.caption ?? "";

  // Extract TOC items from content and create components
  const tocItems = extractTocItems(post.content || []);
  const ptComponents = createPtComponents(tocItems);
  const hasToc = post.showToc === true && tocItems.length > 0;

  return (
    <main className="font-poppins text-lg py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Reserve space for fixed right TOC on lg+ */}
      <div className="mx-auto w-full lg:max-w-7xl lg:pr-[260px]">
        {/* ARTICLE */}
        <article className="mx-auto w-full max-w-[60ch] break-words">
          <h1 className="font-lora text-5xl font-bold mb-2">{post.title}</h1>
          {dateStr && (
            <p className="font-poppins text-sm">Date Published: {dateStr}</p>
          )}
          {post.preview && (
            <p className="text-neutral-600 mt-2">{post.preview}</p>
          )}

          {/* Hero */}
          <div className="flex flex-col w-full justify-center">
            {heroUrl && (
              <Image
                src={heroUrl}
                alt={post.heroImage?.alt || `Hero for ${post.title}`}
                className="mt-4 mb-2 rounded-lg block mx-auto max-w-full h-auto"
                width={1200}
                height={600}
                priority
                sizes="(min-width: 1024px) 66ch, 100vw"
              />
            )}
            <div className="font-poppins text-xs italic text-gray-500">
              {heroDescription}
            </div>
          </div>

          {/* MOBILE inline TOC (< lg) */}
          {tocItems.length > 0 && (
            <div className="w-full">
              <Separator className="my-6 bg-black/40 lg:hidden" />
              <div className="mt-6 lg:hidden">
                <TableOfContents
                  items={tocItems}
                  title="On this page"
                  numbered
                  scrollSpy={false}
                />
              </div>
              <Separator className="my-6 bg-black/40 lg:hidden" />
            </div>
          )}

          {/* Discount Codes */}
          {post.discountCodes?.length > 0 && (
            <DiscountCodes codes={post.discountCodes} />
          )}

          {/* Body */}
          {post.content?.length ? (
            <section className="mt-6">
              <Disclosure />
              <PortableText value={post.content} components={ptComponents} />
            </section>
          ) : (
            <>
              {post.intro && <p className="mt-4">{post.intro}</p>}
              {post.sections?.length > 0 &&
                post.sections.map((section: any, idx: number) => (
                  <section key={idx} className="mt-8">
                    <h2 className="font-lora text-2xl font-bold">
                      {section.heading}
                    </h2>
                    <p className="font-poppins whitespace-pre-line">
                      {section.content}
                    </p>
                  </section>
                ))}
            </>
          )}

          {/* Sources */}
          {post.sources?.length > 0 && (
            <section className="mt-8">
              <h2 className="font-lora text-2xl font-bold">Sources</h2>
              <ul>
                {post.sources.map((src: any, idx: number) => (
                  <li key={idx}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600 underline"
                    >
                      {src.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Tags */}
          {post.tags?.length > 0 && (
            <section className="mt-8">
              <p className="text-sm">Tags: {post.tags.join(", ")}</p>
            </section>
          )}

          {/* Canonical */}
          {post.canonicalUrl && (
            <section className="mt-2">
              <p className="text-xs text-neutral-500">
                Canonical: {post.canonicalUrl}
              </p>
            </section>
          )}

          <HorizontalAd className="my-2 max-w-full overflow-hidden" />
          <div className="w-full flex max-w-full overflow-hidden">
            {post.tags?.length > 0 && (
              <RelevantList tags={post.tags ?? []} currentSlug={post.slug} />
            )}
          </div>
        </article>
      </div>

      {/* FIXED RIGHT TOC (lg+) — fills viewport height */}
      {tocItems.length > 0 && (
        <div className="hidden lg:block">
          <div
            className="
            fixed
            top-[var(--navbar-height,4rem)]
            right-[max(1rem,calc((100vw-80rem)/2+1rem))]  /* aligns with centered 7xl container */
            h-[calc(100vh-var(--navbar-height,4rem))]
            w-[240px]
            overflow-auto
            py-6
          "
          >
            <TableOfContents
              items={tocItems}
              title="On this page"
              numbered
              scrollSpy
              className="h-full"
            />
          </div>
        </div>
      )}
    </main>
  );
}

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchPostSSR(slug);
  if (!post) return notFound();

  return <View post={post} />;
}
