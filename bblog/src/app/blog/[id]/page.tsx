import { notFound } from "next/navigation";
import { POSTS } from "@/data/posts";

type Props = {
  params: { id: string };
};

export default function PostPage({ params }: Props) {
  const post = POSTS.find((p) => p.id === params.id);

  if (!post) return notFound();

  return (
    <main className="font-mont text-lg mx-auto p-6 prose">
      <h1 className="font-lora text-5xl font-bold mb-2 underline underline-offset-8">
        {post.title}
      </h1>
      <p className="font-mont text-sm">Date Published: {post.date}</p>

      {post.disclosure && (
        <p className="bg-secondary text-primary text-sm p-3 rounded border mt-4">
          {post.disclosure}
        </p>
      )}

      <p className="mt-4">{post.intro}</p>

      {post.sections?.map((section, idx) => (
        <section key={idx} className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">
            {section.heading}
          </h2>
          <p>{section.content}</p>
        </section>
      ))}

      {post.supplies && (
        <section className="mt-8">
          <h2 className="font-lora text-2xl font-bold mb-2">Supplies</h2>
          <ul>
            {post.supplies.map((supply, idx) => (
              <li key={idx}>
                <strong>{supply.name}</strong> — {supply.reason}{" "}
                {supply.affiliateUrl && (
                  <a
                    href={supply.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Buy
                  </a>
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
                  rel="noopener noreferrer"
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
