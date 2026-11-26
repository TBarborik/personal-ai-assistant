"use client";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { CONVERSATIONS_UPDATED } from "@/lib/events";

type ConversationItem = {
  id: string;
  title: string;
  updatedAt: string;
};

export function ConversationList() {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    let ac: AbortController | null = null;

    async function load() {
      ac = new AbortController();
      try {
        const response = await fetch("/api/conversations?limit=20", {
          signal: ac.signal,
          cache: "no-store",
        });
        if (!response.ok) return;

        const data: ConversationItem[] = await response.json();

        if (!cancelled) setConversations(data);
      } catch (err) {
        if (!ac.signal.aborted) console.error(err);
      }
    }

    const refresh = () => {
      void load();
    };

    void load();

    window.addEventListener(CONVERSATIONS_UPDATED, refresh);

    return () => {
      if (ac) ac.abort();
      cancelled = true;
      window.removeEventListener(CONVERSATIONS_UPDATED, refresh);
    };
  }, [pathname]);

  return (
    <SidebarMenu>
      {conversations.map((conversation) => {
        const href = `/chat/${conversation.id}`;

        return (
          <SidebarMenuItem key={conversation.id}>
            <SidebarMenuButton
              isActive={pathname === href}
              tooltip={conversation.title}
              render={<Link href={href} />}
            >
              <span className="truncate">{conversation.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
