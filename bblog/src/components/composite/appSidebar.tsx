"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

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
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "hover:bg-primary inline-flex items-center rounded-md px-3 py-2 px-8 text-lg transition-colors justify-center",
        isActive
          ? "underline underline-offset-4 font-bold text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
};

const AppSidebar = () => {
  return (
    <Sidebar
      className="font-playfair absolute left-0 border-none"
      variant="sidebar"
    >
      <SidebarContent className="border-r border-sidebar-border">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/" exact>
                    Home
                  </SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/blog">Blog</SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/about">About</SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/disclaimer">Disclaimer</SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
