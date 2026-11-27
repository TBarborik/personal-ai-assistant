"use client";

import { AnalyticsChartData } from "@/lib/ai/analytics/chart-data";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { formatChartDate, formatNumber, formatUsd } from "@/lib/ai/analytics/format";

const providerLabels: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  mistral: "Mistral",
};

type CostCartProps = {
  data: AnalyticsChartData["costData"];
  providers: string[];
  hasUnpricedRequests?: boolean;
};

export function CostChart({ data, providers, hasUnpricedRequests }: CostCartProps) {
  const chartConfig = Object.fromEntries(
    providers.map((provider, idx) => [provider, { label: providerLabels[provider] ?? provider, color: `var(--chart-${(idx % 5) + 1})` }]),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Denní náklady</CardTitle>
        <CardDescription>Odhadované náklady podle poskytovatele AI</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickFormatter={formatChartDate} tickLine={false} axisLine={false} minTickGap={24} />
            <YAxis tickFormatter={formatUsd} tickLine={false} axisLine={false} width={100} />
            <ChartTooltip
              content={<ChartTooltipContent labelFormatter={(label) => (typeof label === "string" ? formatChartDate(label) : label)} />}
              formatter={(value, name) => (
                <div className="flex w-full items-center gap-2">
                  <div className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: `var(--color-${String(name)})` }} />
                  <span className="text-muted-foreground">{providerLabels[String(name)] ?? String(name)}</span>
                  <span className="ml-auto font-medium tabular-nums">{typeof value === "number" ? formatUsd(value) : "-"}</span>
                </div>
              )}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {providers.map(provider => (
                <Bar stackId="cost" key={provider} dataKey={provider} fill={`var(--color-${provider})`} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
        {hasUnpricedRequests && (
            <p className="text-xs text-muted-foreground">Graf zahrnuje pouze pořadavky se známou cenou. Skutečné náklady mohou být vyšší.</p>
        )}
      </CardContent>
    </Card>
  );
}
