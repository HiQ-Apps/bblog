import { defineType } from "sanity";

export default defineType({
  name: "tableOfContents",
  title: "Table of Contents",
  type: "object",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "Optional custom title (defaults to 'On this page')",
      placeholder: "On this page",
    },
    {
      name: "numbered",
      type: "boolean",
      title: "Numbered",
      description: "Show numbers before each item (1. 2. 3.)",
      initialValue: true,
    },
    {
      name: "scrollSpy",
      type: "boolean",
      title: "Scroll Spy",
      description: "Highlight current section as user scrolls",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      numbered: "numbered",
    },
    prepare({ title, numbered }) {
      return {
        title: title || "Table of Contents",
        subtitle: numbered
          ? "Numbered • Auto-generated from h2/h3 headings"
          : "Unnumbered • Auto-generated from h2/h3 headings",
      };
    },
  },
});
