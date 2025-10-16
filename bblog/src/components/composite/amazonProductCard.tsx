import ProductCard, {
  type GenericProduct,
  type ImgLike,
  type PriceSnap,
} from "./productCard";

type AmazonImgLike = ImgLike;

type AmazonProductProps = {
  value: {
    asin: string;
    product: {
      title: string;
      description?: string;
      imageUrl?: AmazonImgLike;
      detailPageUrl: string | null;
      priceSnapshot?: PriceSnap;
      features?: string[];
    };
  };
};

export default function AmazonProductCard({ value }: AmazonProductProps) {
  const { product } = value;
  if (!product) return null;

  const mapped: GenericProduct = {
    title: product.title,
    description: product.description ?? null,
    image: product.imageUrl ?? null,
    url: product.detailPageUrl ?? undefined,
    priceSnapshot: product.priceSnapshot ?? null,
    retailer: "Amazon",
    features: product.features,
  };

  return <ProductCard product={mapped} />;
}
