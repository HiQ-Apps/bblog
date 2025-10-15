// components/AmazonProductCard.tsx
import Image from "next/image";
// import { AmazonOutlinedIcon } from "../ui/icons/ant-design-amazon-outlined";
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
      <div className="border-3 border-accent bg-white rounded-xl my-3">
        <div className="p-6 md:p-7 lg:p-8">
          <div className="grid items-stretch gap-4 md:gap-6 lg:grid-cols-[300px_1fr]">
            <div className="relative h-64 md:h-72 lg:h-72 overflow-hidden rounded-xl bg-white">
              {img ? (
                <Image
                  src={img}
                  alt={product.title || "Amazon product"}
                  fill
                  className="object-contain p-4"
                  sizes="(min-width:1024px) 320px, 100vw"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="h-full w-full bg-white" aria-hidden />
              )}
            </div>

            <div className="h-full flex flex-col justify-center items-start text-left px-2 md:px-4">
              <div className="flex flex-col items-center text-center w-full">
                <div className="max-w-[32ch] flex flex-col items-center">
                  <h3 className="font-lora text-2xl md:text-2xl font-bold leading-snug">
                    {product.title}
                  </h3>

                  {product.description && (
                    <p
                      itemProp="description"
                      className="mt-2 mb-2 text-sm md:text-base leading-relaxed text-neutral-700 text-center"
                    >
                      {product.description}
                    </p>
                  )}

                  {product.detailPageUrl && (
                    <MotionCTA
                      href={product.detailPageUrl}
                      label={`View ${product.title} on Amazon`}
                    >
                      {prettyPrice} on {site}
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
