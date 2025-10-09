// lib/signPaapi.ts
import crypto from "crypto";

function sha256hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}
function hmac(key: Buffer | string, msg: string) {
  return crypto.createHmac("sha256", key).update(msg, "utf8").digest();
}

type SignInput = {
  method: "POST"; // PA-API uses POST
  host: string; // e.g. webservices.amazon.com
  region: string; // e.g. us-east-1
  service: "ProductAdvertisingAPI";
  path: string; // e.g. /paapi5/searchitems
  body: string; // JSON stringified
  accessKey: string;
  secretKey: string;
  amzTarget: string; // e.g. com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems
};

/**
 * Minimal SigV4 signer for Amazon PA-API v5 (POST + JSON).
 * Returns { headers } to pass to fetch().
 */
export function signPAAPI({
  method,
  host,
  region,
  service,
  path,
  body,
  accessKey,
  secretKey,
  amzTarget,
}: SignInput): { headers: Record<string, string> } {
  // 1) Timestamps
  const iso = new Date().toISOString(); // 2025-10-08T13:04:05.123Z
  const amzDate = iso.replace(/[:-]|\.\d{3}/g, ""); // 20251008T130405Z
  const dateStamp = amzDate.slice(0, 8); // 20251008

  // 2) Payload hash
  const payloadHash = sha256hex(body);

  // 3) Canonical headers (lowercase names, sorted later)
  const headerMap: Record<string, string> = {
    host,
    "content-type": "application/json; charset=UTF-8",
    "x-amz-date": amzDate,
    "x-amz-target": amzTarget,
    "x-amz-content-sha256": payloadHash,
  };
  const signedHeaderNames = Object.keys(headerMap).sort();
  const canonicalHeaders = signedHeaderNames
    .map((n) => `${n}:${headerMap[n].trim()}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");

  // 4) Canonical request
  const canonicalRequest = [
    method,
    path,
    "", // no query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  // 5) String to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256hex(canonicalRequest),
  ].join("\n");

  // 6) Signing key
  const kDate = hmac("AWS4" + secretKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");

  // 7) Signature
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  // 8) Authorization header (final)
  const authorization = `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // 9) Return headers with nicer casing (not required but tidy)
  return {
    headers: {
      Host: host,
      "Content-Type": "application/json; charset=UTF-8",
      "X-Amz-Date": amzDate,
      "X-Amz-Target": amzTarget,
      "X-Amz-Content-Sha256": payloadHash,
      Authorization: authorization,
    },
  };
}
