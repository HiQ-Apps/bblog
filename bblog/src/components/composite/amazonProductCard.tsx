// components/AmazonProductCard.tsx
import Image from "next/image";
import { AmazonOutlinedIcon } from "../ui/icons/ant-design-amazon-outlined";
import { MotionImageFrame, MotionCTA } from "./amazonCardMotion";

type PriceSnap = {
  amount: number;
  currency: string;
  retrievedAt?: string;
} | null;

type ImgSet = {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
};

type ImgLike = string | { asset?: { url?: string } } | null;

interface AmazonProductProps {
  value: {
    asin: string;
    product: {
      title: string;
      description?: string;
      imageUrl?: ImgLike;
      detailPageUrl: string | null;
      priceSnapshot?: PriceSnap;
      features?: string[];
    };
  };
}

function imgUrl(
  u?: ImgLike,
  want: "large" | "medium" | "small" = "large"
): string | null {
  if (!u) return null;
  if (typeof u === "string") return u;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  if ("asset" in (u as any)) return (u as any).asset?.url ?? null;
  const s = u as ImgSet;
  return s[want] ?? s.large ?? s.medium ?? s.small ?? null;
}

function fmtPrice(p?: PriceSnap) {
  if (!p || !p.amount || !p.currency) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: p.currency,
      minimumFractionDigits: 2,
    }).format(p.amount);
  } catch {
    return `$${p.amount}`;
  }
}

function domain(u?: string | null) {
  try {
    if (!u) return null;
    const d = new URL(u).hostname.replace(/^www\./, "");
    return d;
  } catch {
    return null;
  }
}

export default function AmazonProductCard({ value }: AmazonProductProps) {
  const { asin, product } = value;
  if (!product) return null;

  const img = imgUrl(product.imageUrl);
  const prettyPrice = fmtPrice(product.priceSnapshot);
  const asOf = product.priceSnapshot?.retrievedAt
    ? new Date(product.priceSnapshot.retrievedAt).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric" }
      )
    : null;

  const site = domain(product.detailPageUrl) ?? "amazon.com";

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className="group relative"
    >
      {/* Gradient frame with subtle lift-on-hover */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-200 via-rose-200 to-emerald-200 p-[1.5px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:-translate-y-0.5">
        <div className="rounded-[calc(theme(borderRadius.2xl)-2px)] bg-[#fffaf6] border border-[#e7d7cc]">
          {/* Body */}
          <div className="p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
              {/* Image (animated via motion wrapper) */}
              <MotionImageFrame className="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-neutral-50 ring-1 ring-black/5">
                {img ? (
                  <Image
                    src={img}
                    alt={product.title || "Amazon product"}
                    width={900}
                    height={900}
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="h-full w-full" aria-hidden />
                )}
                {/* Non-JS shine fallback (still looks nice without motion) */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute inset-y-0 -left-1/3 w-1/3 -translate-x-full skew-x-12 bg-white/20 blur-xl transition-transform duration-700 ease-in-out group-hover:translate-x-[350%]" />
                </span>
              </MotionImageFrame>

              {/* Content */}
              <div className="min-w-0 flex flex-col gap-2">
                <h3 className="text-2xl md:text-3xl font-bold leading-snug [font-family:var(--font-lora)] text-[#2b2b2b] line-clamp-2">
                  {product.title}
                </h3>

                {product.description && (
                  <p
                    itemProp="description"
                    className="text-sm md:text-[0.95rem] text-neutral-700 line-clamp-3"
                  >
                    {product.description}
                  </p>
                )}

                {Array.isArray(product.features) &&
                  product.features.length > 0 && (
                    <ul className="mt-1 grid gap-1 text-xs text-neutral-700 sm:grid-cols-2">
                      {product.features.slice(0, 4).map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                          <span className="line-clamp-1">{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                {/* Price/meta row */}
                <div className="mt-1 flex flex-wrap items-end gap-3">
                  {prettyPrice ? (
                    <div
                      className="flex flex-col"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <span
                        className="text-lg md:text-xl font-semibold text-emerald-700"
                        aria-label={`Current price ${prettyPrice}${asOf ? ` as of ${asOf}` : ""}`}
                        itemProp="price"
                        content={String(product.priceSnapshot?.amount ?? "")}
                      >
                        {prettyPrice}
                      </span>
                      {asOf && (
                        <span className="text-[11px] text-neutral-500">
                          as of {asOf}
                        </span>
                      )}
                      <meta
                        itemProp="priceCurrency"
                        content={product.priceSnapshot?.currency ?? "USD"}
                      />
                      <link
                        itemProp="availability"
                        href="https://schema.org/InStock"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-neutral-600">
                      Check price on Amazon
                    </span>
                  )}

                  {/* ASIN chip */}
                  <span className="ml-auto rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] text-neutral-500">
                    ASIN: {asin}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer CTA band (animated via motion wrapper) */}
          {product.detailPageUrl && (
            <MotionCTA
              href={product.detailPageUrl}
              label={`View ${product.title} on Amazon`}
            >
              <AmazonOutlinedIcon
                className="h-8 w-8 inline md:hidden"
                aria-hidden
              />
              <span className="hidden md:inline mb-2">View on {site}</span>
            </MotionCTA>
          )}
        </div>
      </div>
    </article>
  );
}
