"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  className?: string;
  prefetch?: boolean;
};

const NavLink = ({
  href,
  children,
  exact,
  className,
  prefetch,
}: NavLinkProps) => {
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
        "hover:bg-primary inline-flex items-center rounded-md px-3 py-2 text-lg transition-colors",
        isActive
          ? "underline underline-offset-4 font-bold text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
