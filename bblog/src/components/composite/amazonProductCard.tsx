// components/AmazonProductCard.tsx
import Image from "next/image";

type PriceSnap = {
  amount: number;
  currency: string;
  retrievedAt?: string;
} | null;
type ImgSet = { small?: string|null; medium?: string|null; large?: string|null };
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
      features?: string[]; // optional if you add later
    };
  };
}

function imgUrl(u?: ImgLike, want: "large"|"medium"|"small"="large"): string|null {
  if (!u) return null;
  if (typeof u === "string") return u;
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

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className="
  overflow-hidden rounded-2xl
  border border-[#e7d7cc]
  bg-[#fffaf6] shadow-sm
"
    >
      
      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-[96px_1fr] md:grid-cols-[112px_1fr] gap-4 md:gap-5">
          {/* Image */}
          <div className="aspect-square rounded-xl bg-neutral-50 ring-1 ring-black/5 overflow-hidden">
            {img ? (
              <Image
                src={img}
                alt={product.title || "Amazon product"}
                width={448}
                height={448}
                className="h-full w-full object-contain"
                sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="h-full w-full" aria-hidden />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex flex-col gap-2">
            <h3
              className="
    text-lg md:text-xl font-bold leading-snug
    [font-family:var(--font-lora)]
    text-[#2b2b2b] line-clamp-2
  "
            >
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

            {Array.isArray(product.features) && product.features.length > 0 && (
              <ul className="mt-1 space-y-1 text-xs text-neutral-600">
                {product.features.slice(0, 2).map((f, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300" />
                    <span className="line-clamp-1">{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Price/meta row */}
            <div className="mt-1 flex items-end gap-3">
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
            </div>

            <div className="mt-1 text-[11px] text-neutral-500">
              ASIN: {asin}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA band */}
      {product.detailPageUrl && (
        <a
          href={product.detailPageUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          aria-label={`View ${product.title} on Amazon`}
className="
  block text-center font-semibold
  bg-amber-300/70 text-black py-2.5
  hover:bg-amber-300 transition
  border-t border-[#eadfd6]
"
        >
          View on Amazon
        </a>
      )}
    </article>
  );
}
