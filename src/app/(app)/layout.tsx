import { AppShell } from "@/components/app-shell";
import React from "react";

export default function Layout({children}: Readonly<React.PropsWithChildren>) {
    return (
        <AppShell>
            {children}
        </AppShell>
    )
}