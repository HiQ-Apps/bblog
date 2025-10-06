// sanity/the-good-standard/lib/live.ts
import { createClient } from "next-sanity";
import { defineLive } from "next-sanity/live";
import { dataset, projectId, apiVersion, sanityReadToken } from "../../env";

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn: false,
  token: sanityReadToken,
  stega: { studioUrl: "/studio" },
});

export const { SanityLive, sanityFetch } = defineLive({
  client,
  browserToken: false,
  serverToken: sanityReadToken,
});
