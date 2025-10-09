// sanity/schemaTypes/amazonEmbed.ts
import { defineType, defineField } from "sanity";
import AmazonInput from "../components/amazonInput";

export default defineType({
  name: "amazonEmbed",
  title: "Amazon Product",
  type: "object",
  components: { input: AmazonInput },
  fields: [
    defineField({
      name: "asin",
      title: "ASIN",
      type: "string",
      description: "Paste ASIN or Amazon product URL.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "product",
      title: "Product",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text" }),
        defineField({ name: "imageUrl", type: "url", title: "Image URL" }),
        defineField({ name: "detailPageUrl", type: "url" }),
        defineField({
          name: "priceSnapshot",
          title: "Price Snapshot",
          type: "object",
          fields: [
            { name: "amount", type: "number" },
            { name: "currency", type: "string" },
            { name: "retrievedAt", type: "datetime" },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "product.title" },
    prepare: ({ title }) => ({
      title: title || "Amazon Product",
      subtitle: "amazonEmbed",
    }),
  },
});
