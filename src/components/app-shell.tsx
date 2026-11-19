"use client";

import { ChatLayout } from "./chat/chat-layout";
import {
  HeaderActionsProvider,
  useHeaderActions,
} from "./layout/header-actions-context";

export function AppShell({ children }: React.PropsWithChildren) {
  return (
    <HeaderActionsProvider>
      <ShellContent>{children}</ShellContent>
    </HeaderActionsProvider>
  );
}

function ShellContent({ children }: React.PropsWithChildren) {
  const { actions } = useHeaderActions();

  return <ChatLayout actions={actions}>{children}</ChatLayout>;
}
