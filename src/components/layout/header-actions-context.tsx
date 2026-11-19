"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type HeaderActionsContextValue = {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
};

const HeaderActionsContext = createContext<HeaderActionsContextValue | null>(
  null,
);

export function HeaderActionsProvider({children}: React.PropsWithChildren) {
    const [actions, setActions] = useState<ReactNode>(null);

    return (
        <HeaderActionsContext.Provider value={{actions, setActions}}>{children}</HeaderActionsContext.Provider>
    )
}

export function useHeaderActions() {
    const context = useContext(HeaderActionsContext);

    if (!context) {
        throw new Error("HeaderActionsProvider is missing.");
    }

    return context;
}