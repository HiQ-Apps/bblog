import Link from "next/link";
import { POSTS } from "@/data/posts";

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <ul className="space-y-8">
        {POSTS.map((post) => (
          <li key={post.id} className="border-b pb-6">
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.id}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-gray-500">{post.date}</p>
            <p className="mt-2 text-gray-700">{post.intro}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
