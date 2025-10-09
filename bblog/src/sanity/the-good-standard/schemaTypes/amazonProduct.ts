// sanity/schemas/amazonProduct.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "amazonProduct",
  title: "Amazon Product",
  type: "document",
  fields: [
    defineField({
      name: "asin",
      title: "ASIN",
      type: "string",
      validation: (r) => r.required().min(10).max(10),
    }),
    defineField({
      name: "marketplace",
      title: "Marketplace",
      type: "string",
      initialValue: "www.amazon.com",
      options: {
        list: [
          { title: "US (.com)", value: "www.amazon.com" },
          { title: "UK (.co.uk)", value: "www.amazon.co.uk" },
          { title: "DE (.de)", value: "www.amazon.de" },
        ],
      },
    }),
    defineField({
      name: "titleOverride",
      title: "Title (override)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image (snapshot)",
      type: "image",
      description:
        "Optional snapshot; normally you’ll render from PA-API response",
      options: { hotspot: true },
    }),
    defineField({
      name: "priceSnapshot",
      title: "Price (snapshot)",
      type: "object",
      fields: [
        { name: "amount", type: "number" },
        { name: "currency", type: "string" },
        { name: "capturedAt", type: "datetime" },
      ],
    }),
    defineField({
      name: "detailPageUrl",
      title: "Detail Page URL",
      type: "url",
    }),
    defineField({ name: "notes", title: "Notes", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "asin", subtitle: "marketplace", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
});
