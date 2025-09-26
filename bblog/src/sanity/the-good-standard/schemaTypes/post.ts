// sanity/schemas/post.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug (id)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date (m-d-y)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnailUrl",
      title: "Thumbnail URL",
      type: "url",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "disclosure",
      title: "Disclosure",
      type: "text",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "heading", title: "Heading", type: "string" },
            { name: "content", title: "Content", type: "text" },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "supplies",
      title: "Supplies",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            {
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "string" }],
            },
            { name: "reason", title: "Reason", type: "text" },
            { name: "affiliateUrl", title: "Affiliate URL", type: "url" },
            {
              name: "merchant",
              title: "Merchant",
              type: "string",
              options: {
                list: ["Amazon", "Awin"], // MerchantType
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: "directions",
      title: "Directions",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "conclusion",
      title: "Conclusion",
      type: "text",
    }),
    defineField({
      name: "sources",
      title: "Sources",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Name", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
  ],
});
