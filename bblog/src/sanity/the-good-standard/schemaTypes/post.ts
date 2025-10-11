// sanity/schemas/post.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (id)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Publish Date",
      type: "datetime",
    }),

    // SEO
    defineField({ name: "metaTitle", title: "Meta Title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),

    // Cards/SEO excerpt
    defineField({
      name: "preview",
      title: "Excerpt (for cards/SEO)",
      type: "text",
      rows: 3,
    }),

    // Hero
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),

    // Use your shared Portable Text type
    defineField({ name: "content", title: "Content", type: "blockContent" }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "metaImage",
      title: "Social share image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "canonicalUrl", type: "url" }),

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
  preview: {
    select: { title: "title", media: "heroImage", slug: "slug.current" },
    prepare({ title, media, slug }) {
      return { title, media, subtitle: slug ? `/${slug}` : "No slug set" };
    },
  },
});
