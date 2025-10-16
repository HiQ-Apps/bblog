import { defineType, defineField } from "sanity";

export default defineType({
  name: "productCard",
  title: "Product Card",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({ name: "productName", type: "string", title: "Product Name" }),
    defineField({ name: "link", type: "url", title: "Product Link" }),
    defineField({
      name: "price",
      type: "string",
      title: "Price (e.g. $19.99)",
    }),
    defineField({
      name: "retailer",
      type: "string",
      title: "Retailer (e.g. Etsy)",
    }),
    defineField({ name: "description", type: "text", title: "Description" }),
  ],
});
