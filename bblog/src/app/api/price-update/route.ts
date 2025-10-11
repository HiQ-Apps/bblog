import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { paapiFetch } from "@/lib/paapi";
import groq from "groq";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2025-01-01",
  useCdn: false,
});

type Prod = {
  _id: string;
  asin: string;
  marketplace?: string;
  capturedAt?: string;
};

const SLEEP_MS = 1100;
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPrice(asin: string, marketplace = "www.amazon.com") {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let lastErr: any;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const data = await paapiFetch("GetItems", {
        ItemIds: [asin],
        Marketplace: marketplace,
        Resources: ["Offers.Listings.Price"],
      });
      const item = data?.ItemsResult?.Items?.[0];
      const price = item?.Offers?.Listings?.[0]?.Price;
      if (price?.Amount != null && price?.Currency) {
        return {
          amount: Number(price.Amount),
          currency: String(price.Currency),
        };
      }
      throw new Error("No price in PA-API response");
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (e: any) {
      lastErr = e;
      // backoff on throttle
      const msg = String(e?.message || "");
      const backoff = i * 1000;
      if (
        msg.includes("TooManyRequests") ||
        msg.includes("throttl") ||
        msg.includes("429")
      ) {
        await sleep(SLEEP_MS + backoff);
        continue;
      }
      throw e;
    }
  }
  throw lastErr;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
async function patchBothVariants(id: string, patch: any) {
  const tx = sanity.transaction();
  tx.patch(id, (p) => p.set(patch));
  tx.patch(`drafts.${id}`, (p) => p.set(patch));
  try {
    await tx.commit();
  } catch {
    try {
      await sanity.patch(id).set(patch).commit();
    } catch {}
    try {
      await sanity.patch(`drafts.${id}`).set(patch).commit();
    } catch {}
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") || "0");
  const dryRun = url.searchParams.get("dryRun") === "1";
  const since = url.searchParams.get("since");

  try {
    const query = groq`
      *[_type == "amazonProduct"${
        since
          ? ` && ( !defined(priceSnapshot.capturedAt) || priceSnapshot.capturedAt < $since )`
          : ""
      }]{
        _id, asin, marketplace, "capturedAt": priceSnapshot.capturedAt
      } | order(_updatedAt desc)
    `;
    const all: Prod[] = await sanity.fetch(query, { since });

    // Optional cap
    const targets = limit > 0 ? all.slice(0, limit) : all;

    // Dedupe by asin+marketplace so we call PA-API once per unique product
    const uniqKey = (p: Prod) =>
      `${p.asin}::${p.marketplace || "www.amazon.com"}`;
    const groups = new Map<string, Prod[]>();
    for (const p of targets) {
      if (!p.asin) continue;
      const k = uniqKey(p);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(p);
    }

    const processed: Array<{
      asin: string;
      marketplace: string;
      ids: string[];
      ok: boolean;
      error?: string;
    }> = [];

    for (const [key, docs] of groups.entries()) {
      const [asin, marketplace = "www.amazon.com"] = key.split("::");
      try {
        if (!dryRun) {
          const price = await fetchPrice(asin, marketplace);
          const patch = {
            priceSnapshot: {
              amount: price.amount,
              currency: price.currency,
              capturedAt: new Date().toISOString(),
            },
          };

          // patch every doc that shares this ASIN+marketplace (draft + published)
          await Promise.all(docs.map((d) => patchBothVariants(d._id, patch)));
        }

        processed.push({
          asin,
          marketplace,
          ids: docs.map((d) => d._id),
          ok: true,
        });
        /* eslint-disable @typescript-eslint/no-explicit-any */
      } catch (e: any) {
        processed.push({
          asin,
          marketplace,
          ids: docs.map((d) => d._id),
          ok: false,
          error: e?.message ?? "Failed",
        });
      }

      // throttle between unique PA-API calls
      await sleep(SLEEP_MS);
    }

    return NextResponse.json({
      ok: true,
      dryRun,
      totalDocs: targets.length,
      uniqueItems: groups.size,
      processed,
    });
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Refresh failed" },
      { status: 500 }
    );
  }
}
