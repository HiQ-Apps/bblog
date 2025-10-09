// sanity/the-good-standard/lib/live.ts
import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";

export const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || "2025-09-27",
  perspective: "raw",
  useCdn: false,
  token: process.env.SANITY_STUDIO_READ_TOKEN!,
  stega: { studioUrl: "/studio" },
});

export const { SanityLive, sanityFetch } = defineLive({
  client,
  browserToken: false,
  serverToken: process.env.SANITY_STUDIO_READ_TOKEN!,
});
