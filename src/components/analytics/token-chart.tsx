"use client";

import { AnalyticsChartData } from "@/lib/ai/analytics/chart-data";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatChartDate, formatNumber } from "@/lib/ai/analytics/format";

const chartConfig = {
    input: {
        label: "Vstupní tokeny",
        color: "var(--chart-1)"
    },
    output: {
        label: "Výstupní tokeny",
        color: "var(--chart-2)"
    }
} satisfies ChartConfig;

type TokenChartProps = {
    data: AnalyticsChartData["tokenData"];
}

export function TokenChart({data}: TokenChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Spotřeba tokenů</CardTitle>
                <CardDescription>Denní spotřeba vstupních a výstupních tokenů</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
                    <LineChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false}/>
                        <XAxis dataKey="day" tickFormatter={formatChartDate} tickLine={false} axisLine={false} minTickGap={24} />
                        <YAxis tickFormatter={formatNumber} tickLine={false} axisLine={false} width={65} />
                        <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => typeof label === "string" ? formatChartDate(label) : label} />} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line dataKey="input" type="linear" stroke="var(--color-input)" strokeWidth={2} dot={false} activeDot={{r: 4}} connectNulls={false} />
                        <Line dataKey="output" type="linear" stroke="var(--color-output)" strokeWidth={2} dot={false} activeDot={{r: 4}} connectNulls={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}