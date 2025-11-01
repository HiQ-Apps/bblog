// components/composite/tableOfContents.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export type TocItem = { id: string; text: string; level: 2 | 3 };

type Props = {
  items: TocItem[];
  title?: string;
  numbered?: boolean;
  className?: string;
  scrollSpy?: boolean;
};

export default function TableOfContents({
  items,
  title = "On this page",
  numbered = true,
  className = "",
  scrollSpy = true,
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollSpy || !items?.length) return;
    const heads = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean) as HTMLElement[];
    if (heads.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        // Prefer the first visible heading; fallback to the one nearest to top
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
          return;
        }
        // Fallback: pick the first heading above the fold
        const above = entries
          .filter((e) => e.boundingClientRect.top < 100)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
        if (above[0]?.target?.id) setActiveId(above[0].target.id);
      },
      {
        root: null,
        // Top margin helps switch earlier; bottom negative keeps it stable
        rootMargin: "0px 0px -70% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );
    heads.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items, scrollSpy]);

  if (!items?.length) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={`relative h-full flex flex-col pt-12 ${className}`}
    >
      {/* Vertical timeline line */}
      <div className="absolute left-0 top-12 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-neutral-300 to-transparent" />

      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-8 pl-6 font-medium">
        {title}
      </div>

      <ul className="space-y-6 relative flex-1">
        {items.map((it, idx) => {
          const isActive = activeId === it.id;
          return (
            <li
              key={it.id}
              className={`relative transition-all duration-300 ${
                it.level === 3 ? "pl-8" : "pl-6"
              }`}
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-accent scale-150 shadow-lg shadow-accent/50"
                    : "bg-neutral-300 scale-100"
                }`}
              />

              <Link
                href={`#${it.id}`}
                className={`block text-xs leading-relaxed transition-all duration-300 ${
                  isActive
                    ? "text-accent font-semibold translate-x-1"
                    : "text-neutral-600 hover:text-accent hover:translate-x-1"
                }`}
                aria-current={isActive ? "true" : undefined}
              >
                {numbered && (
                  <span className="opacity-50 mr-1">{idx + 1}.</span>
                )}
                {it.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
