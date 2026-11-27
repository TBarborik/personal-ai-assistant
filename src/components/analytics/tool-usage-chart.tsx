"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ToolUsage } from "@/lib/db/usage";

const chartConfig = {
    callCount: {
        label: "Počet volání",
        color: "var(--chart-1)"
    }
}

type ToolUsageChartProps = {
  data: ToolUsage
};

export function ToolUsageChart({ data }: ToolUsageChartProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Využití nástrojů</CardTitle>
        <CardDescription>Počet volání jednotlivých nástrojů</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">Ve zvoleném období nebyly použity žádné nástroje.</div>
        ): (
            <ChartContainer config={chartConfig} className="aspect-auto w-full" style={{height: Math.max(180, data.length * 40 + 40)}}>
            <BarChart accessibilityLayer data={data} layout="vertical">
                <CartesianGrid vertical={false} />
                <XAxis type="number"  allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="toolName" tickLine={false} axisLine={false} width={140} interval={0} />
                <ChartTooltip
                content={<ChartTooltipContent/>}
                />
                <Bar dataKey="callCount" fill="var(--color-callCount)" radius={[0, 4, 4, 0]} maxBarSize={24} />
          </BarChart>
        </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
