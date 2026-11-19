import { AppSidebar } from "../app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

type ChatLayoutProps = React.PropsWithChildren<{
    actions?: React.ReactNode
}>;

export function ChatLayout({children, actions}: ChatLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 min-h-0 h-svh overflow-hidden">
                <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
                    <SidebarTrigger />
                    <span className="font-medium">Personal AI</span>
                    <div className="ml-auto">
                        {actions}
                    </div>
                </header>
                <main className="flex min-h-0 flex-1 items-center flex-col overflow-hidden">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}