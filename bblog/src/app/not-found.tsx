// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-gray-500">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 text-gray-600">
        Sorry, we couldn’t find the page you’re looking for.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="rounded-xl border px-4 py-2 text-sm transition bg-secondary hover:bg-secondary/90 text-white"
        >
          Go home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl bg-secondary px-4 py-2 text-sm text-white transition hover:opacity-90 hover:bg-secondary/90"
        >
          Browse articles
        </Link>
      </div>
    </main>
  );
}
