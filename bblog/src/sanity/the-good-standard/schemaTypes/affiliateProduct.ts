import { defineType, defineField } from "sanity";

export default defineType({
  name: "affiliateProduct",
  title: "Affiliate Product",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: r => r.required() }),
    defineField({
      name: "vendor",
      type: "string",
      options: { list: ["Amazon", "Quince", "HexClad", "Other"] },
      initialValue: "Amazon",
    }),
    defineField({
      name: "url",
      title: "Affiliate URL",
      type: "url",
      validation: r => r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "asin",
      title: "ASIN (optional, Amazon)",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
      validation: r => r.required(),
    }),
    defineField({
      name: "priceText",
      title: "Price/Label (text)",
      type: "string",
      description: "Keep it generic (e.g., 'From $129') to avoid price compliance issues.",
    }),
    defineField({
      name: "badge",
      title: "Badge (optional)",
      type: "string",
      description: "e.g., Best Seller, Editor’s Pick",
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "string",
      initialValue: "View on Amazon",
    }),
    defineField({
      name: "disclosure",
      title: "Disclosure",
      type: "boolean",
      initialValue: true,
      description: "Show 'I may earn a commission…' line beneath the card.",
    }),
    defineField({
      name: "nofollow",
      title: "Add rel='nofollow sponsored'",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", media: "image", vendor: "vendor", price: "priceText" },
    prepare: ({ title, media, vendor, price }) => ({
      title: title || "Untitled product",
      subtitle: [vendor, price].filter(Boolean).join(" • "),
      media,
    }),
  },
});