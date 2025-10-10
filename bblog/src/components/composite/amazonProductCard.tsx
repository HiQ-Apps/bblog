// components/AmazonProductCard.tsx
import Image from "next/image";

type PriceSnap = { amount: number; currency: string; retrievedAt?: string } | null;
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

function imgUrl(u?: ImgLike): string | null {
  if (!u) return null;
  if (typeof u === "string") return u;
  return u.asset?.url ?? null;
}

function fmtPrice(p?: PriceSnap) {
  if (!p || !p.amount || !p.currency) return null;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: p.currency }).format(p.amount);
  } catch {
    return `$${p.amount}`;
  }
}

export default function AmazonProductCard({ value }: AmazonProductProps) {
  const { asin, product } = value;
  if (!product) return null;

  const img = imgUrl(product.imageUrl);
  const prettyPrice = fmtPrice(product.priceSnapshot);
  const asOf =
    product.priceSnapshot?.retrievedAt
      ? new Date(product.priceSnapshot.retrievedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })
      : null;

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-[96px_1fr] gap-4">
        {/* Image */}
        <div className="aspect-square rounded-xl bg-neutral-50 ring-1 ring-black/5 overflow-hidden">
          {img ? (
            <Image
              src={img}
              alt={product.title || "Amazon product"}
              width={500}
              height={500}
              className="h-full w-full object-contain"
              sizes="(max-width: 640px) 96px, 120px"
            />
          ) : (
            <div className="h-full w-full" aria-hidden />
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col gap-2">
          <h3 className="text-base font-medium leading-snug line-clamp-2">
            {product.title}
          </h3>

          {product.description && (
            <p className="text-sm text-neutral-700 line-clamp-3">{product.description}</p>
          )}

          {/* Optional feature bullets if you add them */}
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

          <div className="mt-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

            {prettyPrice ? (
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-semibold text-emerald-600">
                  {prettyPrice}
                </span>
                {asOf && (
                  <span className="text-[11px] text-neutral-500">as of {asOf}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-neutral-600">Check price on Amazon</span>
            )}

            {product.detailPageUrl && (
              <a
                href={product.detailPageUrl}
                target="_blank"
                rel="nofollow sponsored noopener"
                aria-label={`View ${product.title} on Amazon`}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium bg-amber-400 hover:bg-amber-500 text-black shadow ring-1 ring-black/5 transition-colors"
              >
                View on Amazon
              </a>
            )}
          </div>

          <div className="mt-1 text-[11px] text-neutral-500">ASIN: {asin}</div>
        </div>
      </div>
    </article>
  );
}
