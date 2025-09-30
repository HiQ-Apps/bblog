export const SITE_NAME = "The Good Standard";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://thegoodstandard.org";
export const DEFAULT_DESCRIPTION =
  "A blog about the things that make life good.";
export const DEFAULT_OG_IMAGE = "/LOGO.png";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
