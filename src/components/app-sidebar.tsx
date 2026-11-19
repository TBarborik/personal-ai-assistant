import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "./ui/sidebar";
import { ConversationList } from "./chat/conversation-list";
import { AppSidebarNavigation } from "./app-sidebar-navigation";
import { AppSidebarBottom } from "./app-sidebar-bottom";
import { Suspense } from "react";
import { Button } from "./ui/button";
import { MessageCirclePlus } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-4 font-semibold">Personal AI</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <MessageCirclePlus />
                Nová konverzace
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Navigace</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense>
              <AppSidebarNavigation />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Konverzace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Suspense>
                <ConversationList />
              </Suspense>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Suspense>
          <AppSidebarBottom />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}
