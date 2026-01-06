import { defineType, defineField } from "sanity";

export default defineType({
  name: "quoteBlock",
  title: "Quote Block",
  type: "object",
  fields: [
    defineField({ name: "quote", type: "text", title: "Quote" }),
    defineField({ name: "author", type: "string", title: "Author" }),
  ],
});
