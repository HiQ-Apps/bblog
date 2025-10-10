import { NextResponse } from "next/server";
import { signPAAPI } from "@/lib/signPaapi";

const HOST = "webservices.amazon.com";
const PATH = "/paapi5/getitems";
const SERVICE = "ProductAdvertisingAPI";
const REGION = "us-east-1";
const PARTNER_TAG = "thegoodstanda-20";
const MARKETPLACE = "www.amazon.com";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Amz-Date, X-Amz-Target, X-Amz-Content-Sha256",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const asin = searchParams.get("asin");

    if (!asin) {
      return NextResponse.json(
        { error: "asin required" },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Build request body
    const bodyObj = {
      ItemIds: [asin],
      Resources: [
        "Images.Primary.Medium",
        "Images.Primary.Large",
        "ItemInfo.Title",
        "Offers.Listings.Price",
      ],
      PartnerTag: PARTNER_TAG,
      PartnerType: "Associates",
      Marketplace: MARKETPLACE,
    };
    const body = JSON.stringify(bodyObj);

    const amzTarget = "com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems";

    // Sign EXACTLY the headers we will send
    const { headers: signed } = signPAAPI({
      method: "POST",
      host: HOST,
      region: REGION,
      service: SERVICE,
      path: PATH,
      body,
      accessKey: process.env.AMAZON_ACCESS_KEY!,
      secretKey: process.env.AMAZON_SECRET_KEY!,
      amzTarget,
    });

    // Minimal, polite extras (not signed)
    const extras = {
      accept: "application/json",
      "user-agent": "TheGoodStandard/1.0 (+https://thegoodstandard.co)",
    };

    // Do the call (you can add retry/backoff if needed)
    const resp = await fetch(`https://${HOST}${PATH}`, {
      method: "POST",
      headers: {
        ...signed,
        ...extras,
      },
      body,
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: "paapi_error", details: text },
        { status: resp.status, headers: corsHeaders() }
      );
    }

    const data = await resp.json();
    const item = data?.ItemsResult?.Items?.[0];

    if (!item) {
      return NextResponse.json(
        { error: "not_found" },
        { status: 404, headers: corsHeaders() }
      );
    }

    // Normalize the shape for your frontend
    const title: string = item?.ItemInfo?.Title?.DisplayValue ?? "";
    const description: string = (
      item?.ItemInfo?.Features?.DisplayValues ?? []
    ).join(" • ");
    const imageUrl: string | null =
      item?.Images?.Primary?.Large?.URL ??
      item?.Images?.Primary?.Medium?.URL ??
      null;
    const detailPageUrl: string | null = item?.DetailPageURL ?? null;

    const priceListing = item?.Offers?.Listings?.[0]?.Price;
    const amount = priceListing?.Amount ?? null;
    const currency = priceListing?.Currency ?? null;

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

    return NextResponse.json(normalized, { headers: corsHeaders() });
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    console.error("Unhandled error in /api/amazon-search:", e);
    return NextResponse.json(
      { error: "internal_server_error", message: String(e?.message || e) },
      { status: 500, headers: corsHeaders() }
    );
  }
}
