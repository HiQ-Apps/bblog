"use client";

import { NextStudio } from "next-sanity/studio";
// adjust the relative path if needed (this assumes sanity.config.ts is in the project root)
import config from "@/sanity/the-good-standard/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
