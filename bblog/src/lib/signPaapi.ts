// lib/signPaapi.ts
import crypto from "crypto";

function sha256hex(s: string) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}
function hmac(key: Buffer | string, msg: string) {
  return crypto.createHmac("sha256", key).update(msg, "utf8").digest();
}

type SignInput = {
  method: "POST";
  host: string;
  region: string;
  service: "ProductAdvertisingAPI";
  path: string;
  body: string;
  accessKey: string;
  secretKey: string;
  amzTarget: string;
};

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
  // 1) Timestamp
  const iso = new Date().toISOString(); // 2025-10-09T...
  const amzDate = iso.replace(/[:-]|\.\d{3}/g, ""); // 20251009T123456Z
  const dateStamp = amzDate.slice(0, 8); // 20251009

  // 2) Payload hash
  const payloadHash = sha256hex(body);

  // 3) Canonical headers (all LOWERCASE keys)
  const headerMap: Record<string, string> = {
    host,
    "content-type": "application/json; charset=UTF-8",
    "content-encoding": "amz-1.0", // <-- add this
    "x-amz-date": amzDate,
    "x-amz-target": amzTarget,
    "x-amz-content-sha256": payloadHash,
  };

  const signedHeaderNames = Object.keys(headerMap).sort(); // alpha by name
  const canonicalHeaders = signedHeaderNames
    .map((n) => `${n}:${headerMap[n].trim()}\n`)
    .join("");
  const signedHeaders = signedHeaderNames.join(";");

  // 4) Canonical request
  const canonicalRequest = [
    method,
    path,
    "", // query string
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

  // 6) Derive signing key
  const kDate = hmac("AWS4" + secretKey, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");

  // 7) Signature
  const signature = crypto
    .createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  // 8) Authorization header
  const authorization =
    `${algorithm} Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  // 9) Return EXACTLY the headers you signed (any case is fine when sending)
  return {
    headers: {
      Host: host,
      "Content-Type": "application/json; charset=UTF-8",
      "Content-Encoding": "amz-1.0", // <-- send it
      "X-Amz-Date": amzDate,
      "X-Amz-Target": amzTarget,
      "X-Amz-Content-Sha256": payloadHash,
      Authorization: authorization,
    },
  };
}
