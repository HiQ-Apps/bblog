// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./schemaTypes";
import resolveProductionUrl from "./lib/resolveProductionUrl";
import { SanityDocument } from "next-sanity";
import { priceUpdaterTool } from "./plugins/price-updater";

export default defineConfig({
  name: "default",
  title: "The Good Standard",
  version: process.env.SANITY_STUDIO_API_VERSION,
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: process.env.SANITY_STUDIO_DATASET as string,
  basePath: "/studio",
  plugins: [structureTool(), visionTool(), priceUpdaterTool()],
  schema: { types: schema.types },

  document: {
    productionUrl: async (prev, { document }) => {
      const url = resolveProductionUrl(document as SanityDocument);
      return url ?? prev;
    },
  },
});
