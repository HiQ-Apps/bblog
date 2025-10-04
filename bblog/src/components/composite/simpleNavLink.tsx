"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SimpleNavLinkProps = {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
};

const SimpleNavLink = ({ href, children, exact }: SimpleNavLinkProps) => {
  const pathname = usePathname();

  const normalize = (p: string) =>
    p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

  const cur = normalize(pathname);
  const dest = normalize(href);

  const isActive = exact
    ? cur === dest
    : dest === "/"
      ? cur === "/"
      : cur.startsWith(dest);
  return (
    <Link
      href={href}
      className={cn(
        "block p-2 text-lg",
        isActive ? "bg-primary text-black font-bold" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
};

export default SimpleNavLink;
