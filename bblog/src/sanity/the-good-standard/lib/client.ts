import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-09-27",
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export const previewClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: process.env.SANITY_API_VERSION || "2025-09-27",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

export const getClient = (preview: boolean) =>
  preview ? previewClient : client;
