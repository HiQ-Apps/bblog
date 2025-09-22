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
import NavLink from "@/components/composite/navLink";

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
                <SidebarMenuButton className="justify-center">
                  <NavLink href="/">Home</NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="justify-center">
                  <NavLink href="/blog">Blog</NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="justify-center">
                  <NavLink href="/about">About</NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="justify-center">
                <NavLink href="/disclaimer">Disclaimer</NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
