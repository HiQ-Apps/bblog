// sanity/schemas/objects/downloadGroup.ts
import { defineType } from "sanity";

export default defineType({
  name: "downloadGroup",
  title: "Download Group",
  type: "object",
  fields: [
    {
      name: "items",
      type: "array",
      of: [{ type: "downloadLink" }],
      validation: (r) => r.min(1),
    },
  ],
});
