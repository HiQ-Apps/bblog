// components/nav-link.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

type Props = {
  href: string;
  children: React.ReactNode;
  exact?: boolean; // exact match for "/" etc.
  className?: string;
  prefetch?: boolean;
};

export default function NavLink({
  href,
  children,
  exact,
  className,
  prefetch,
}: Props) {
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
      prefetch={prefetch}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "inline-flex items-center rounded-md px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
}
