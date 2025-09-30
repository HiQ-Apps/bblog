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

export const sanityReadToken = assertValue(
  process.env.NEXT_PUBLIC_SANITY_READ_TOKEN,
  "Missing environment variable: NEXT_PUBLIC_SANITY_READ_TOKEN"
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
