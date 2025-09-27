// app/post/[id]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import groq from "groq";
import { PortableText, PortableTextComponents } from "@portabletext/react";

import { POSTS } from "@/data/posts";
import { sanityFetch } from "@/sanity/the-good-standard/lib/live"; // ← uses defineLive()
import { Card, CardContent } from "@/components/ui/card";

type PageProps = { params: { id: string } };

export const dynamic = "force-dynamic"; // this page will be server-side rendered on every request

const POST_BY_SLUG = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  preview,
  heroImage{ asset->{ url, metadata { dimensions { width, height } } }, alt, caption },
  content[]{
    ...,
    _type == "image" => {
      asset->{ url, metadata { dimensions { width, height } } },
      alt,
      link
    }
  },
  tags,
  metaImage{ asset->{ url, metadata { dimensions { width, height } } } },
  canonicalUrl,
  sources[]{ name, url }
}`;

// Portable Text renderers
const ptComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const rel = value?.nofollow ? "nofollow sponsored" : "noopener";
      return (
        <a href={value?.href} target="_blank" rel={rel}>
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
    h2: ({ children }) => (
      <h2 className="font-lora text-3xl font-bold mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-lora text-2xl font-bold mt-6">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
  },
};

// Reusable view (works for both Sanity docs and local POSTS shape)
function View({ post }: { post: any }) {
  if (!post) return notFound();

  const dateStr = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString()
    : (post.date ?? null);

  const heroUrl: string | null =
    post.heroImage?.asset?.url ?? post.thumbnailUrl ?? null;

  const supplies = post.supplies?.map((s: any) => ({
    name: s?.name ?? "",
    reason: s?.reason ?? "",
    merchant: s?.merchant ?? "",
    affiliateUrl: s?.affiliateUrl ?? null,
    images:
      s?.images?.map((i: any) => i?.asset?.url ?? i)?.filter(Boolean) ?? [],
  }));

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
          <PortableText value={post.content} components={ptComponents} />
        </section>
      ) : (
        <>
          {post.disclosure && (
            <p className="bg-secondary text-primary text-sm p-3 rounded border mt-4">
              {post.disclosure}
            </p>
          )}

          {post.intro && <p className="mt-4">{post.intro}</p>}

          {post.sections?.length > 0 &&
            post.sections.map((section: any, idx: number) => (
              <section key={idx} className="mt-8">
                <h2 className="font-lora text-2xl font-bold">
                  {section.heading}
                </h2>
                <p className="whitespace-pre-line">{section.content}</p>
              </section>
            ))}
        </>
      )}

      {supplies?.length > 0 && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Supplies</h2>
          <ul>
            {supplies.map((s: any, idx: number) => (
              <li key={idx} className="flex flex-col">
                <p>
                  <strong>{s.name}</strong>
                  {s.reason ? <> — {s.reason}</> : null}
                </p>
                {s.affiliateUrl && (
                  <Card className="flex bg-secondary mt-2 mb-8">
                    <a
                      href={s.affiliateUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600"
                    >
                      <CardContent className="flex flex-col items-center">
                        {s.images?.[0] && (
                          <Image
                            src={s.images[0]}
                            alt={s.name}
                            width={200}
                            height={100}
                            className="inline-block mr-2"
                          />
                        )}
                        Redirect to {s.merchant || "Merchant"} Store
                      </CardContent>
                    </a>
                  </Card>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {post.directions?.length > 0 && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Directions</h2>
          <ol className="list-decimal list-inside">
            {post.directions.map((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {post.conclusion && (
        <section className="mt-8">
          <p>{post.conclusion}</p>
        </section>
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

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: sanityPost } = await sanityFetch({
    query: POST_BY_SLUG,
    params: { slug: params.slug },
  });

  // Optional: keep your local fallback working by slug
  const local = POSTS.find(
    (p: any) => p.slug === params.slug || p.id === params.slug
  );
  const post = sanityPost ?? local;

  if (!post) return notFound();
  return <View post={post} />;
}
