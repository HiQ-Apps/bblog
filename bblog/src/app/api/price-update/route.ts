import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import groq from "groq";
import { paapiFetch } from "@/lib/paapi";

/** ----------------- CORS + Auth ----------------- **/
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ADMIN_TOKEN = process.env.PRICE_UPDATE_SECRET;

function isAllowedOrigin(origin: string) {
  if (!origin) return false;
  const o = origin.trim().toLowerCase();
  return (
    ALLOWED_ORIGINS.includes("*") ||
    ALLOWED_ORIGINS.some((a) => a.trim().toLowerCase() === o)
  );
}

function buildCorsHeaders(origin: string) {
  const h = new Headers();
  if (isAllowedOrigin(origin)) {
    h.set("Access-Control-Allow-Origin", origin);
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
  if (!ADMIN_TOKEN) return; // allow open in dev if you remove the secret
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
type BlockTarget = {
  postId: string;
  blockKey: string;
  asin: string;
  marketplace: string;
};

const SLEEP_MS = 1100; // throttle between unique PA-API calls
const MAX_RETRIES = 3;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchPrice(asin: string, marketplace = "www.amazon.com") {
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

async function patchNestedPath(id: string, path: string, value: unknown) {
  const setObj = { [path]: value } as Record<string, unknown>;
  const tx = sanity.transaction();
  tx.patch(id, (p) => p.set(setObj));
  tx.patch(`drafts.${id}`, (p) => p.set(setObj));
  try {
    await tx.commit();
  } catch {
    try {
      await sanity.patch(id).set(setObj).commit();
    } catch {}
    try {
      await sanity.patch(`drafts.${id}`).set(setObj).commit();
    } catch {}
  }
}

/** --------------- Main POST handler --------------- **/
export async function POST(req: Request) {
  // Auth first
  try {
    assertAdmin(req);
  } catch (e: any) {
    return withCors(
      req,
      NextResponse.json(
        { error: e?.message || "Unauthorized" },
        { status: 401 }
      )
    );
  }

  // Accept params from query OR JSON body
  const url = new URL(req.url);
  const qsLimit = url.searchParams.get("limit");
  const qsDryRun = url.searchParams.get("dryRun");
  const qsSince = url.searchParams.get("since");

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
    // 1) Query parent posts with embedded amazonProduct blocks
    const query = groq`
      *[_type == "post"]{
        _id,
        "items": content[
          _type == "amazonProduct"${
            since
              ? ` && ( !defined(product.priceSnapshot.retrievedAt)
                       || product.priceSnapshot.retrievedAt < $since )`
              : ""
          }
        ]{
          _key,
          asin,
          "marketplace": coalesce(marketplace, "www.amazon.com")
        }
      } | order(_updatedAt desc)
    `;

    const posts: Array<{
      _id: string;
      items?: Array<{ _key: string; asin: string; marketplace?: string }>;
    }> = await sanity.fetch(query, { since });

    // Flatten blocks
    const blocks: BlockTarget[] = [];
    for (const post of posts) {
      for (const it of post.items ?? []) {
        if (!it?.asin) continue;
        blocks.push({
          postId: post._id,
          blockKey: it._key,
          asin: it.asin,
          marketplace: it.marketplace || "www.amazon.com",
        });
      }
    }

    // Optional cap
    const targets = limit > 0 ? blocks.slice(0, limit) : blocks;

    // Group by asin+marketplace
    const groups = new Map<string, BlockTarget[]>();
    for (const t of targets) {
      const k = `${t.asin}::${t.marketplace}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(t);
    }

    // 2) Process per unique item
    const processed: Array<{
      asin: string;
      marketplace: string;
      targets: Array<{ postId: string; blockKey: string }>;
      ok: boolean;
      error?: string;
    }> = [];

    for (const [key, docs] of groups.entries()) {
      const [asin, marketplace = "www.amazon.com"] = key.split("::");
      try {
        if (!dryRun) {
          const price = await fetchPrice(asin, marketplace);
          const value = {
            amount: price.amount,
            currency: price.currency,
            retrievedAt: new Date().toISOString(),
          };
          await Promise.all(
            docs.map((t) =>
              patchNestedPath(
                t.postId,
                `content[_key=="${t.blockKey}"].product.priceSnapshot`,
                value
              )
            )
          );
        }

        processed.push({
          asin,
          marketplace,
          targets: docs.map((d) => ({
            postId: d.postId,
            blockKey: d.blockKey,
          })),
          ok: true,
        });
      } catch (e: any) {
        processed.push({
          asin,
          marketplace,
          targets: docs.map((d) => ({
            postId: d.postId,
            blockKey: d.blockKey,
          })),
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
        totalBlocks: targets.length,
        uniqueItems: groups.size,
        processed,
      })
    );
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
