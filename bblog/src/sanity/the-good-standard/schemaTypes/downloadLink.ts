import { defineType, defineField } from "sanity";
import { FileText } from "lucide-react";

export default defineType({
  name: "downloadLink",
  title: "Download (PDF)",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button Label",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "file",
      title: "PDF File",
      type: "file",
      options: { storeOriginalFilename: true, accept: "application/pdf" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "forceDownload",
      title: "Force Download",
      type: "boolean",
      initialValue: true,
      description:
        "If on, clicking prompts a download instead of opening in the browser.",
    }),
    defineField({
      name: "downloadName",
      title: "Custom Download Filename",
      type: "string",
      description:
        "Optional. e.g. gratitude-journal-1.pdf (fallback is the original filename).",
    }),
  ],
  preview: {
    select: {
      title: "label",
      fileName: "file.asset->originalFilename",
    },
    prepare: ({ title, fileName }) => ({
      title: title || "Download (PDF)",
      subtitle: fileName || "No file",
      media: FileText,
    }),
  },
});
