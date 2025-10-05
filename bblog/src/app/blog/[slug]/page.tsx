// app/post/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Disclosure from "@/components/composite/disclosureCard";
import { Post } from "@/types/Post";
import { baseUrl } from "@/sanity/env";
import { SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/seo";

export const revalidate = 120;

async function fetchPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${baseUrl}/api/posts/by-slug/${slug}`, {
    next: { revalidate },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata(
   { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const post = await fetchPost((await params).slug);
  if (!post) return {};

  const title = post.seoTitle?.trim() || post.title;
  const description = post.seoDescription?.trim() || post.preview?.trim() || DEFAULT_DESCRIPTION;

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

const ptComponents: PortableTextComponents = {
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
      const url: string | undefined = value?.asset?.url;
      if (!url) return null;
      const w = value?.asset?.metadata?.dimensions?.width ?? 1200;
      const h = value?.asset?.metadata?.dimensions?.height ?? 700;
      const alt = value?.alt || "";
      const img = (
        <Image
          src={url}
          alt={alt}
          width={w}
          height={h}
          className="rounded-lg my-4"
        />
      );
      return value?.link ? (
        <a href={value.link} target="_blank" rel="noopener">
          {img}
        </a>
      ) : (
        img
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="font-mont text-xl my-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="font-lora text-3xl font-bold mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-lora text-2xl font-bold mt-6">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-mont text-xl border-l-4 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
};

// Reusable view (works for both Sanity docs and local POSTS shape)
/* eslint-disable @typescript-eslint/no-explicit-any */
function View({ post }: { post: any }) {
  if (!post) return notFound();

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : (post.date ?? null);

  const heroUrl: string | null =
    post.heroImage?.asset?.url ?? post.thumbnailUrl ?? null;

  return (
    <main className="font-mont max-w-4xl text-lg mx-auto p-6 prose">
      <h1 className="font-lora text-5xl font-bold mb-2">{post.title}</h1>
      {dateStr && (
        <p className="font-mont text-sm">Date Published: {dateStr}</p>
      )}
      {post.preview && <p className="text-neutral-600 mt-2">{post.preview}</p>}

      <div className="flex w-full justify-center">
        {heroUrl && (
          <Image
            src={heroUrl}
            alt={post.heroImage?.alt || `Hero for ${post.title}`}
            className="mt-4 mb-2 rounded-lg"
            width={1200}
            height={600}
            priority
          />
        )}
      </div>

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
                <p className="font-mont whitespace-pre-line">
                  {section.content}
                </p>
              </section>
            ))}
        </>
      )}

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

      {post.tags?.length > 0 && (
        <section className="mt-8">
          <p className="text-sm">Tags: {post.tags.join(", ")}</p>
        </section>
      )}

      {post.canonicalUrl && (
        <section className="mt-2">
          <p className="text-xs text-neutral-500">
            Canonical: {post.canonicalUrl}
          </p>
        </section>
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
  const data = await fetch(`${baseUrl}/api/posts/by-slug/${slug}`);
  if (!data.ok) {
    return notFound();
  }
  const post: Post = await data.json();

  return <View post={post} />;
}
