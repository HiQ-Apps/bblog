// sanity/schemas/amazonProduct.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "amazonProduct",
  title: "Amazon Product",
  type: "object",
  fields: [
    defineField({
      name: "asin",
      title: "ASIN",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "product",
      title: "Product Details",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "text",
        },
        {
          name: "imageUrl",
          title: "Image",
          type: "object",
          fields: [
            {
              name: "asset",
              type: "object",
              fields: [{ name: "url", type: "url" }],
            },
          ],
        },
        {
          name: "detailPageUrl",
          title: "Amazon URL",
          type: "url",
        },
        {
          name: "priceSnapshot",
          title: "Price Snapshot",
          type: "object",
          fields: [
            { name: "amount", type: "number" },
            { name: "currency", type: "string" },
            { name: "retrievedAt", type: "datetime" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "product.title",
      subtitle: "asin",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || subtitle,
      subtitle: `ASIN: ${subtitle}`,
    }),
  },
});
