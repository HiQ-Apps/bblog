import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== "undefined" && err instanceof DOMException) {
    return err.name === "AbortError";
  }
  return err instanceof Error && err.name === "AbortError";
}

export function parseTags(url: URL): string[] {
  // accepts ?tags=foo,bar and/or repeated ?tags=foo&tags=bar; also allows ?tag=foo
  const list = [
    ...url.searchParams.getAll("tags"),
    url.searchParams.get("tag") ?? "",
  ];
  return Array.from(
    new Set(
      list
        .flatMap((s) => s.split(","))
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean)
    )
  );
}
