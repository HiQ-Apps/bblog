import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { paapiFetch } from "@/lib/paapi";
import groq from "groq";

/** ----------------- CORS + Auth ----------------- **/
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
// Example env:
// CORS_ORIGINS=https://<your>.sanity.studio,http://localhost:3333,https://thegoodstandard.co

const ADMIN_TOKEN = process.env.PRICE_UPDATE_SECRET;

function isAllowedOrigin(origin: string) {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes("*") || ALLOWED_ORIGINS.includes(origin);
}

function buildCorsHeaders(origin: string) {
  const h = new Headers();
  if (isAllowedOrigin(origin)) {
    h.set("Access-Control-Allow-Origin", origin); // echo origin for credentials-compat
    h.set("Vary", "Origin");
  }
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  h.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  h.set("Access-Control-Max-Age", "86400");
  // If you ever need cookies across origins, also set:
  // h.set("Access-Control-Allow-Credentials", "true");
  return h;
}

function withCors(req: Request, res: NextResponse) {
  const origin = req.headers.get("origin") ?? "";
  const cors = buildCorsHeaders(origin);
  cors.forEach((v, k) => res.headers.set(k, v));
  return res;
}

function assertAdmin(req: Request) {
  if (!ADMIN_TOKEN) return; // allow open if you really want in dev
  const auth = req.headers.get("authorization") || "";
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    throw new Error("Unauthorized");
  }
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(origin),
  });
}
/** --------------- End CORS + Auth --------------- **/

/** ----------------- Sanity client ---------------- **/
const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!, // server-side write token
  apiVersion: "2025-01-01",
  useCdn: false,
});

/** ----------------- Types & utils ---------------- **/
type Prod = {
  _id: string;
  asin: string;
  marketplace?: string;
  capturedAt?: string;
};

const SLEEP_MS = 1100; // throttle between unique PA-API calls
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

/** --------------- Main POST handler --------------- **/
export async function POST(req: Request) {
  // Auth first
  try {
    assertAdmin(req);

    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    return withCors(
      req,
      NextResponse.json(
        { error: e?.message || "Unauthorized" },
        { status: 401 }
      )
    );
  }

  // Accept params from either query string or JSON body
  const url = new URL(req.url);
  const qsLimit = url.searchParams.get("limit");
  const qsDryRun = url.searchParams.get("dryRun");
  const qsSince = url.searchParams.get("since");

  /* eslint-disable @typescript-eslint/no-explicit-any */
  let body: any = null;
  try {
    if (req.headers.get("content-type")?.includes("application/json")) {
      body = await req.json();
    }
  } catch {
    // ignore invalid JSON
  }

  const limit = Number((body?.limit ?? qsLimit) || "0");
  const dryRun =
    String(body?.dryRun ?? qsDryRun ?? "") === "1" || body?.dryRun === true;
  const since = (body?.since ?? qsSince) as string | undefined;

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

    const targets = limit > 0 ? all.slice(0, limit) : all;

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

      await sleep(SLEEP_MS);
    }

    return withCors(
      req,
      NextResponse.json({
        ok: true,
        dryRun,
        totalDocs: targets.length,
        uniqueItems: groups.size,
        processed,
      })
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    return withCors(
      req,
      NextResponse.json(
        { error: e?.message ?? "Refresh failed" },
        { status: 500 }
      )
    );
  }
}
