import Link from "next/link";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname } from "next/navigation";

export function AppSidebarBottom() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/settings" />}
              isActive={pathname === "/settings"}
            >
              <span>Nastavení</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
    )
}