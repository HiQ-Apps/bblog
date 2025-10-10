import { signPAAPI } from "./signPaapi";

export type PaapiOperation = "SearchItems" | "GetItems";

type CommonPayload = {
  PartnerTag: string;
  PartnerType: "Associates";
  Marketplace: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [k: string]: any;
};

const SERVICE = "ProductAdvertisingAPI";
const PATHS: Record<PaapiOperation, string> = {
  SearchItems: "/paapi5/searchitems",
  GetItems: "/paapi5/getitems",
};

function targetFor(op: PaapiOperation) {
  return `com.amazon.paapi5.v1.ProductAdvertisingAPIv1.${op}`;
}

export type PaapiConfig = {
  accessKey: string;
  secretKey: string;
  host: string; // webservices.amazon.com
  region: string; // us-east-1
  marketplace: string; // www.amazon.com
};

export function getPaapiConfigFromEnv(): PaapiConfig {
  const accessKey = process.env.AMAZON_ACCESS_KEY!;
  const secretKey = process.env.AMAZON_SECRET_KEY!;
  const host = "webservices.amazon.com";
  const region = "us-east-1";
  const marketplace = "www.amazon.com";

  if (!accessKey || !secretKey) {
    throw new Error("Missing PAAPI_ACCESS_KEY or PAAPI_SECRET_KEY");
  }
  return { accessKey, secretKey, host, region, marketplace };
}

/**
 * Call PA-API with SigV4 signing.
 * Example:
 * paapiFetch("SearchItems", {
 *   Keywords: "air purifier filter",
 *   Resources: ["Images.Primary.Medium","ItemInfo.Title","Offers.Listings.Price"]
 * })
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function paapiFetch<T = any>(
  op: PaapiOperation,
  payload: Omit<CommonPayload, "PartnerTag" | "PartnerType" | "Marketplace"> & {
    PartnerTag?: string;
    PartnerType?: "Associates";
    Marketplace?: string;
  }
): Promise<T> {
  const cfg = getPaapiConfigFromEnv();
  const bodyObj: CommonPayload = {
    PartnerTag: payload.PartnerTag ?? process.env.ASSOCIATE_TAG!,
    PartnerType: "Associates",
    Marketplace: payload.Marketplace ?? cfg.marketplace,
    ...payload,
  };
  const body = JSON.stringify(bodyObj);

  const path = PATHS[op];
  const amzTarget = targetFor(op);

  const { headers } = signPAAPI({
    method: "POST",
    host: cfg.host,
    region: cfg.region,
    service: SERVICE,
    path,
    body,
    accessKey: cfg.accessKey,
    secretKey: cfg.secretKey,
    amzTarget,
  });

  const url = `https://${cfg.host}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body,
  });

  const text = await res.text();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let json: any;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      `PA-API non-JSON response (${res.status}): ${text.slice(0, 200)}`
    );
  }

  if (!res.ok) {
    const message = json?.Errors?.[0]?.Message || `HTTP ${res.status}`;
    throw new Error(`PA-API error: ${message}`);
  }

  return json as T;
}
