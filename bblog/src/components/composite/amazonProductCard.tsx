// components/AmazonProductCard.tsx
import Image from "next/image";

interface AmazonProductProps {
  value: {
    asin: string;
    product: {
      title: string;
      description?: string;
      imageUrl?: { asset: { url: string } } | null;
      detailPageUrl: string | null;
      priceSnapshot?: {
        amount: number;
        currency: string; // e.g. "USD"
        retrievedAt: string;
      } | null;
    };
  };
}

export default function AmazonProductCard({ value }: AmazonProductProps) {
  const { asin, product } = value;
  if (!product) return null;

  const img = product.imageUrl?.asset?.url ?? null;

  const priceStr =
    product.priceSnapshot &&
    typeof product.priceSnapshot.amount === "number" &&
    product.priceSnapshot.currency
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: product.priceSnapshot.currency,
        }).format(product.priceSnapshot.amount)
      : null;

  return (
    <div className="my-8 rounded-lg border bg-gray-50 p-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Product Image */}
        {img && (
          <div className="shrink-0">
            <Image
              src={img}
              alt={product.title || "Amazon product image"}
              width={200}
              height={200}
              sizes="(max-width: 640px) 100vw, 200px"
              className="rounded-lg object-contain"
            />
          </div>
        )}

        {/* Product Details */}
        <div className="flex-1">
          <h3 className="mb-2 text-xl font-bold">{product.title}</h3>

          {product.description && (
            <p className="mb-4 text-gray-700">{product.description}</p>
          )}

          {priceStr && (
            <div className="mb-4">
              <span className="text-2xl font-bold text-green-700">
                {priceStr}
              </span>
            </div>
          )}

          {product.detailPageUrl ? (
            <a
              href={product.detailPageUrl}
              target="_blank"
              rel="noopener noreferrer sponsored nofollow"
              className="inline-block rounded bg-yellow-400 px-6 py-2 font-bold text-black transition-colors hover:bg-yellow-500"
              aria-label={`View ${product.title} on Amazon`}
            >
              View on Amazon
            </a>
          ) : null}

          <p className="mt-2 text-xs text-gray-500">ASIN: {asin}</p>

          {/* Optional tiny disclosure (good practice for affiliates) */}
          <p className="mt-1 text-[10px] text-gray-400">
            As an Amazon Associate, I earn from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  );
}
