import { notFound } from "next/navigation";
import { POSTS } from "@/data/posts";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  params: { id: string };
};

export default function PostPage({ params }: Props) {
  const id = params?.id;
  const post = POSTS.find((p) => p.id === id);

  if (!post) return notFound();

  return (
    <main className="font-mont max-w-4xl text-lg mx-auto p-6 prose">
      <h1 className="font-lora text-5xl font-bold mb-2">{post.title}</h1>
      <p className="font-mont text-sm">Date Published: {post.date}</p>

      <div className="flex w-full justify-center">
        {post.thumbnailUrl && (
          <Image
            src={post.thumbnailUrl}
            alt={`Thumbnail for ${post.title}`}
            className="mt-4 mb-2 rounded-lg"
            width={900}
            height={200}
          />
        )}
      </div>

      {post.disclosure && (
        <p className="bg-secondary text-primary text-sm p-3 rounded border mt-4">
          {post.disclosure}
        </p>
      )}

      <p className="mt-4">{post.intro}</p>

      {post.sections?.map((section, idx) => (
        <section key={idx} className="mt-8">
          <h2 className="font-lora text-2xl font-bold">{section.heading}</h2>
          <p className="whitespace-pre-line">{section.content}</p>
        </section>
      ))}

      {post.supplies && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Supplies</h2>
          <ul>
            {post.supplies.map((supply, idx) => (
              <li key={idx} className="flex flex-col">
                <p>
                  <strong>{supply.name}</strong> — {supply.reason}
                </p>
                {/* Multi images possible, just map out when we get there */}
                {supply.affiliateUrl && (
                  <Card className="flex bg-secondary mt-2 mb-8">
                    <a
                      href={supply.affiliateUrl as string}
                      target="_blank"
                      rel="noopener"
                      className="text-blue-600"
                    >
                      <CardContent className="flex flex-col items-center">
                        {supply.images.length > 0 && (
                          <Image
                            src={supply.images[0]}
                            alt={supply.name}
                            width={200}
                            height={100}
                            className="inline-block mr-2"
                          />
                        )}
                        Redirect to {supply.merchant} Store
                      </CardContent>
                    </a>
                  </Card>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {post.directions && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Directions</h2>
          <ol className="list-decimal list-inside">
            {post.directions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      )}

      {post.conclusion && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Conclusion</h2>
          <p>{post.conclusion}</p>
        </section>
      )}

      {post.sources && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold">Sources</h2>
          <ul>
            {post.sources.map((src, idx) => (
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
    </main>
  );
}
