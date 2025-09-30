// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./schemaTypes";
import resolveProductionUrl from "./lib/resolveProductionUrl";
import { SanityDocument } from "next-sanity";

export default defineConfig({
  name: "default",
  title: "The Good Standard",
  version: process.env.SANITY_API_VERSION || "2025-09-27",
  projectId: process.env.SANITY_PROJECT_ID || "c7t7wvdr",
  dataset: process.env.SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: { types: schema.types },

  document: {
    productionUrl: async (prev, { document }) => {
      const url = resolveProductionUrl(document as SanityDocument);
      return url ?? prev;
    },
  },
});
