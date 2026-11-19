"use client";

import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Chat",
    href: "/",
  },
  {
    title: "Dokumenty",
    href: "/documents",
  },
  {
    title: "Analytika",
    href: "/analytics",
  },
];

export function AppSidebarNavigation() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map(({ title, href }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            render={<Link href={href} />}
            isActive={pathname === href}
          >
            {title}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
