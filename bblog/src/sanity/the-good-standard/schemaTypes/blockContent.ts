// sanity/schemas/blockContent.ts
import { defineType, defineArrayMember } from "sanity";
import AmazonInput from "../components/amazonInput";

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
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              {
                name: "href",
                type: "url",
                validation: (r) =>
                  r.uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
              {
                name: "nofollow",
                type: "boolean",
                title: "nofollow/sponsored",
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "amazonProduct",
      components: {
        input: AmazonInput,
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        { name: "alt", type: "string", title: "Alt text" },
        { name: "caption", type: "string", title: "Caption" },
        { name: "link", type: "url", title: "Optional Link" },
      ],
    }),
  ],
});
