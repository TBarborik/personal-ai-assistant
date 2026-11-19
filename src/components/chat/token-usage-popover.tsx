"use client"

import { AppUIMessage } from "@/lib/ai/types"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChartNoAxesCombined } from "lucide-react";
import { Button } from "../ui/button";
import { TokenUsageChart } from "./token-chart-usage";
import { formatNumber } from "@/lib/format";

type Props = {
    messages: AppUIMessage[]
}

export function TokenUsagePopover({messages}: Props) {
    const total = messages.reduce((sum, message) => message.role !== "assistant" ? sum : (sum + (message.metadata?.usage?.totalTokens ?? 0)), 0);

    return (
        <Popover>
            <PopoverTrigger render={<Button variant="outline" size="sm" />}>
                <ChartNoAxesCombined />
                {formatNumber(total)} tokenů
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[min(90vw,440px)]">
                <div className="space-y-3">
                    <div>
                        <h3 className="font-semibold">Spotřeba konverzace</h3>
                        <p className="text-xs text-muted-foreground">Tokeny podle jednotlivých odpovědí</p>
                    </div>
                    <TokenUsageChart messages={messages} />
                </div>
            </PopoverContent>
        </Popover>
    )
}