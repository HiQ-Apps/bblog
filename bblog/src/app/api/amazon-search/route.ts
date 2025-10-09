// app/api/amazon/get-item/route.ts
import { NextResponse } from "next/server";
import { signPAAPI } from "@/lib/signPaapi";

const HOST = "webservices.amazon.com";
const PATH = "/paapi5/getitems";
const SERVICE = "ProductAdvertisingAPI";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const asin = searchParams.get("asin");

  if (!asin) {
    return NextResponse.json({ error: "asin required" }, { status: 400 });
  }

  const bodyObj = {
    ItemIds: [asin],
    Resources: [
      "Images.Primary.Medium",
      "Images.Primary.Large",
      "ItemInfo.Title",
      "ItemInfo.Features",
      "ItemInfo.ByLineInfo",
      "Offers.Listings.Price",
      "Offers.Listings.SavingBasis",
    ],
    PartnerTag: "thegoodstanda-20",
    PartnerType: "Associates",
    Marketplace: "www.amazon.com",
  };
  const body = JSON.stringify(bodyObj);

  const amzTarget = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";

  const { headers } = signPAAPI({
    method: "POST",
    host: HOST,
    region: "us-east-1",
    service: SERVICE,
    path: PATH,
    body,
    accessKey: process.env.AMAZON_ACCESS_KEY!,
    secretKey: process.env.AMAZON_SECRET_KEY!,
    amzTarget,
  });

  const resp = await fetch(`https://${HOST}${PATH}`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "x-amz-target": amzTarget,
      ...headers,
    },
    body,
  });

  if (!resp.ok) {
    const text = await resp.text();
    return NextResponse.json(
      { error: "paapi_error", details: text },
      { status: 500 }
    );
  }

  const data = await resp.json();

  const item = data?.ItemsResult?.Items?.[0];
  if (!item) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  // Normalize
  const title = item?.ItemInfo?.Title?.DisplayValue || "";
  const description = (item?.ItemInfo?.Features?.DisplayValues || []).join(
    " • "
  );
  const imageUrl =
    item?.Images?.Primary?.Large?.URL ||
    item?.Images?.Primary?.Medium?.URL ||
    null;
  const detailPageUrl = item?.DetailPageURL || null;

  const priceListing = item?.Offers?.Listings?.[0]?.Price;
  const amount = priceListing?.Amount || null;
  const currency = priceListing?.Currency || null;

  const normalized = {
    asin,
    product: {
      title,
      description,
      imageUrl: imageUrl ? { asset: { url: imageUrl } } : null,
      detailPageUrl,
      priceSnapshot:
        amount && currency
          ? { amount, currency, retrievedAt: new Date().toISOString() }
          : null,
    },
  };

  return NextResponse.json(normalized);
}
