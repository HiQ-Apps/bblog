"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import SimpleNavLink from "./simpleNavLink";
import ContactCard from "./contactCard";

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
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/" exact>
                    Home
                  </SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Accordion
                type="single"
                collapsible
                defaultValue="blog"
                className="w-full"
              >
                <AccordionItem value="blog" className="border-none">
                  <AccordionTrigger
                    className="
                      px-0 items-center
                    "
                  >
                    <SidebarMenuButton
                      asChild
                      className="flex w-full items-center justify-between text-black/60 hover:text-black"
                    >
                      <div className="flex w-full items-center justify-between">
                        <p className="text-xl">Blog</p>
                      </div>
                    </SidebarMenuButton>
                  </AccordionTrigger>

                  <AccordionContent className="px-2 pb-2">
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SimpleNavLink href="/blog" exact>
                          Posts
                        </SimpleNavLink>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SimpleNavLink href="/blog/tags">Tags</SimpleNavLink>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/about">About</SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Disclaimer */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SimpleNavLink href="/disclaimer">Disclaimer</SimpleNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="fixed bottom-0 left-0 flex justify-center items-center px-1">
        <ContactCard />
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
