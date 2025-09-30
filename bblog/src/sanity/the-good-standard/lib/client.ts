// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID!;
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-01-01";

const token = process.env.SANITY_API_READ_TOKEN;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: "previewDrafts",

  stega: { enabled: true },
});

export const getClient = (preview: boolean) =>
  preview ? previewClient : client;
