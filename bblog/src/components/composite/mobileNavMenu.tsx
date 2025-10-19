"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import ContactCard from "./contactCard";

const MobileNavMenu = () => {
  return (
    <NavigationMenu
      viewport={false}
      className="w-full bg-primary border-b border-sidebar-border font-playfair justify-center"
    >
      <NavigationMenuList className="mx-auto flex gap-2 py-2">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex p-2 justify-center align-center">
            Blog
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/blog">Posts</Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link href="/blog/tags">Tags</Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/disclaimer">Disclaimer</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="p-2">Contact</NavigationMenuTrigger>
          <NavigationMenuContent className="p-0 z-20 flex bg-primary">
            <ContactCard />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
export default MobileNavMenu;
