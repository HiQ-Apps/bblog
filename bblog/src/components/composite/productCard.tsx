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
      <div className="border-3 border-accent bg-white rounded-xl my-3 w-full">
        <div className="p-4 sm:p-5 md:p-6">
          {/* wrapper inside the card */}
          <div
            className="
              grid grid-cols-1
              lg:[grid-template-columns:280px_minmax(0,1fr)]
              gap-4 md:gap-6
              items-start md:items-center   /* ⬅ top on mobile, centered on md+ */
            "
          >
            {/* Left: image */}
            <MotionImageFrame className="relative overflow-hidden rounded-xl bg-white aspect-[4/3] md:aspect-auto md:h-72">
              <Image
                src={img}
                alt={title || "Product image"}
                fill
                className="object-contain object-center"
                sizes="(min-width:1024px) 320px, (min-width:768px) 50vw, 100vw"
                loading="lazy"
                decoding="async"
              />
            </MotionImageFrame>

            {/* Right: text */}
            <div className="min-w-0 flex flex-col justify-center items-center text-center md:items-start md:text-left px-1 sm:px-2">
              <div className="w-full max-w-[38ch] md:max-w-none">
                <h3 className="font-lora text-xl sm:text-2xl font-bold leading-snug break-words">
                  {title}
                </h3>

                {description && (
                  <p
                    itemProp="description"
                    className="mt-2 mb-3 text-sm md:text-base leading-relaxed text-neutral-700 break-words"
                  >
                    {description}
                  </p>
                )}

                {features?.length ? (
                  <ul className="mt-1 mb-4 list-disc list-inside text-left text-sm text-neutral-700 space-y-1 break-words">
                    {features.slice(0, 5).map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                ) : null}

                {url && (
                  <div className="w-full">
                    <MotionCTA href={url} label={`View ${title} on ${site}`}>
                      {prettyPrice
                        ? `${prettyPrice} on ${site}`
                        : `View on ${site}`}
                    </MotionCTA>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
