// sanity/schemas/blockContent.ts
import { defineType, defineArrayMember } from "sanity";

export default defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
    }),

    defineArrayMember({
      type: "amazonEmbed",
    }),

    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
      ],
    }),
  ],
});
