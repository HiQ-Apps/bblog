export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-09-27";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID"
);

export const amazonAccessKey = assertValue(
  process.env.AMAZON_ACCESS_KEY,
  "Missing environment variable: AMAZON_ACCESS_KEY"
);

export const amazonSecretKey = assertValue(
  process.env.AMAZON_SECRET_KEY,
  "Missing environment variable: AMAZON_SECRET_KEY"
);

export const amazonPartnerTag = assertValue(
  process.env.NEXT_PUBLIC_AMAZON_PARTNER_TAG,
  "Missing environment variable: NEXT_PUBLIC_AMAZON_PARTNER_TAG"
);

export const amazonHost =
  process.env.NEXT_PUBLIC_PAAPI_HOST || "webservices.amazon.com";

export const amazonRegion = process.env.NEXT_PUBLIC_PAAPI_REGION || "us-east-1";

export const amazonMarketplace =
  process.env.NEXT_PUBLIC_PAAPI_MARKETPLACE || "www.amazon.com";

export const sanityOrigin = assertValue(
  process.env.NEXT_PUBLIC_SANITY_ORIGIN,
  "Missing environment variable: NEXT_PUBLIC_SANITY_ORIGIN"
);

export const sanityReadToken = assertValue(
  process.env.SANITY_READ_TOKEN,
  "Missing environment variable: SANITY_READ_TOKEN"
);

export const baseUrl = assertValue(
  process.env.NEXT_PUBLIC_BASE_URL,
  "Missing environment variable: NEXT_PUBLIC_BASE_URL"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
