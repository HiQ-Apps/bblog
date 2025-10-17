import Image from "next/image";
import { MotionImageFrame, MotionCTA } from "./cardMotionWrapper";

/** ---------- Shared types ---------- **/
export type PriceSnap = {
  amount: number;
  currency: string;
  retrievedAt?: string;
} | null;

export type ImgSet = {
  small?: string | null;
  medium?: string | null;
  large?: string | null;
};

export type ImgLike = string | { asset?: { url?: string } } | ImgSet | null;

export type GenericProduct = {
  /** Required */
  title: string;
  /** Link to product page */
  url?: string | null;
  /** Main image (string URL, Sanity image {asset: {url}}, or ImgSet) */
  image?: ImgLike;
  /** Optional bits */
  description?: string | null;
  priceSnapshot?: PriceSnap;
  retailer?: string | null; // e.g. "Amazon", "Etsy"
  features?: string[]; // short bullet list
};

/** ---------- Utils (kept local to the card) ---------- **/
function imgUrl(u?: ImgLike, want: "large" | "medium" | "small" = "large") {
  if (!u) return null;
  if (typeof u === "string") return u;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ("asset" in (u as any)) return (u as any)?.asset?.url ?? null;
  const s = u as ImgSet;
  return s?.[want] ?? s?.large ?? s?.medium ?? s?.small ?? null;
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
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** ---------- Component ---------- **/
export default function ProductCard({
  product,
  className,
}: {
  product: GenericProduct;
  className?: string;
}) {
  const { title, description, image, url, priceSnapshot, retailer, features } =
    product;

  const img = imgUrl(image);
  const prettyPrice = fmtPrice(priceSnapshot);

  const site = retailer ?? domain(url) ?? "shop";

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className={`group relative ${className ?? ""}`}
    >
      <div className="border-3 border-accent bg-white rounded-xl my-3">
        <div className="p-6 md:p-7 lg:p-8">
          <div className="grid items-stretch gap-4 md:gap-6 lg:grid-cols-[300px_1fr]">
            {/* Image */}
            <MotionImageFrame className="relative h-64 md:h-72 lg:h-72 overflow-hidden rounded-xl bg-white">
              {img ? (
                <Image
                  src={img}
                  alt={title || "Product image"}
                  fill
                  className="object-contain p-4"
                  sizes="(min-width:1024px) 320px, 100vw"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="h-full w-full bg-white" aria-hidden />
              )}
            </MotionImageFrame>
            <div className="h-full flex flex-col justify-center items-start text-left px-2 md:px-4">
              <div className="flex flex-col items-center text-center w-full">
                <div className="max-w-[32ch] flex flex-col items-center">
                  <h3 className="font-lora text-2xl md:text-2xl font-bold leading-snug">
                    {title}
                  </h3>

                  {description && (
                    <p
                      itemProp="description"
                      className="mt-2 mb-2 text-sm md:text-base leading-relaxed text-neutral-700 text-center"
                    >
                      {description}
                    </p>
                  )}

                  {features && features.length > 0 && (
                    <ul className="mt-2 mb-4 list-disc list-inside text-left text-sm text-neutral-700">
                      {features.slice(0, 5).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  )}

                  {url && (
                    <MotionCTA href={url} label={`View ${title} on ${site}`}>
                      {prettyPrice
                        ? `${prettyPrice} on ${site}`
                        : `View on ${site}`}
                    </MotionCTA>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
