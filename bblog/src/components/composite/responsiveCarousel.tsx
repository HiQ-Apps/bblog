"use client";

import { useEffect, useMemo, useRef, useState, PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";

type PostResponse = {
  _id: string;
  slug: string;
  title: string;
  preview?: string;
  heroImage?: { asset?: { url?: string }; alt?: string };
};

type ResponsiveCarouselProps = {
  items: PostResponse[];
  heading?: string;
  className?: string;
  /** Minimum slide width under lg; adjust to taste */
  minCardRem?: number; // default 18
  /** Gap between cards in px (Tailwind gap-4 = 16px) */
  gapPx?: number; // default 16
  /** Scroll by how many "pages" (1 = viewport width) */
  pagesPerClick?: number; // default 1
};

export default function ResponsiveCarousel({
  items,
  heading = "Related Posts",
  className = "",
  minCardRem = 18,
  gapPx = 16,
  pagesPerClick = 1,
}: ResponsiveCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const hasItems = items.length > 0;

  const updateButtons = () => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    // allow tiny epsilon for floating rounding
    const EPS = 2;
    setCanPrev(scrollLeft > EPS);
    setCanNext(scrollLeft + clientWidth < scrollWidth - EPS);
  };

  useEffect(() => {
    updateButtons();
    const el = trackRef.current;
    if (!el) return;

    // Recompute on scroll/resize
    const onScroll = () => updateButtons();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);

    // If only ~1 card fits, center the first card (nice initial look)
    const card = el.querySelector<HTMLElement>("[data-slide]");
    if (card) {
      // if less than 2 * minCardRem fits, treat as "one per view"
      const onePerView = el.clientWidth < remToPx(minCardRem * 2);
      if (onePerView) {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        el.scrollLeft = Math.max(0, cardCenter - el.clientWidth / 2);
      } else {
        el.scrollLeft = 0;
      }
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, minCardRem]);

  const onPrev = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: -pagesPerClick * el.clientWidth, behavior: "smooth" });
  };
  const onNext = () => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: pagesPerClick * el.clientWidth, behavior: "smooth" });
  };

  const slideBasisClass = useMemo(() => {
    // 1-up under lg (card min width), 2-up at lg (basis-1/2).
    // We keep cards from stretching too wide by constraining the inner card to max-w.
    return `basis-[${minCardRem}rem] lg:basis-1/2`;
  }, [minCardRem]);

  return (
    <section className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{heading}</h2>
        {/* Optional “See more” link — wire up if you pass tags */}
      </div>

      {!hasItems && (
        <p className="py-4 text-sm text-neutral-500">No related posts found.</p>
      )}

      {hasItems && (
        <div className="mt-3 w-full">
          <div className="relative">
            {/* Scroll area */}
            <div
              ref={trackRef}
              role="region"
              aria-roledescription="carousel"
              aria-label={heading}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") onPrev();
                if (e.key === "ArrowRight") onNext();
              }}
              className={[
                // layout
                "flex w-full overflow-x-auto scroll-smooth",
                // gaps & padding (scroll-padding helps snap-center at edges)
                "gap-4 px-4",
                // scrolling
                "snap-x snap-mandatory",
                // nicer scrollbars (hide on WebKit)
                "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                // ensure snap centering looks good at edges
                "scroll-px-4",
              ].join(" ")}
              // enable inertial/drag on touch
            >
              {items.map((p) => (
                <div
                  key={p._id}
                  data-slide
                  className={[
                    "shrink-0",
                    slideBasisClass,
                    // snap center so single-visible card centers
                    "snap-center",
                  ].join(" ")}
                >
                  <Link href={`/blog/${p.slug}`} className="block h-full">
                    <article className="mx-auto h-full w-full max-w-[18rem] rounded-2xl border bg-card p-3 shadow-sm transition hover:shadow-md">
                      <div className="relative w-full overflow-hidden rounded-lg aspect-[4/3]">
                        {p.heroImage?.asset?.url ? (
                          <Image
                            src={p.heroImage.asset.url}
                            alt={p.heroImage.alt || p.title}
                            fill
                            className="object-cover"
                            loading="lazy"
                            decoding="async"
                            sizes="(min-width:1024px) 50vw, 90vw"
                            draggable={false}
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <h3 className="mt-2 line-clamp-2 text-base font-semibold">
                        {p.title}
                      </h3>
                      {p.preview && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {p.preview}
                        </p>
                      )}
                    </article>
                  </Link>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-3 flex w-full justify-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={onPrev}
                disabled={!canPrev}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground/80 shadow-sm transition hover:bg-accent disabled:opacity-40"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={onNext}
                disabled={!canNext}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground/80 shadow-sm transition hover:bg-accent disabled:opacity-40"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function remToPx(rem: number) {
  if (typeof window === "undefined") return rem * 16;
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize || "16"
  );
  return rem * rootFontSize;
}
