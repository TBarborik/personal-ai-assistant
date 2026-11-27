"use client";

import { type AppUIMessage } from "@/lib/ai/types";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ModelId } from "@/lib/ai/model-catalog";

type TokenUsageChartProps = {
  messages: AppUIMessage[];
};

type TokenData = {
  message: number;
  input: number;
  output: number;
  total: number;
  model?: ModelId;
};

function getTokenData(messages: AppUIMessage[]): TokenData[] {
  let total = 0;

  return messages
    .filter((message) => message.role === "assistant" && message.metadata?.usage != null)
    .map((message, idx) => {
      const usage = message.metadata!.usage!;
      const input = usage.inputTokens ?? 0;
      const output = usage.outputTokens ?? 0;
      total += usage.totalTokens ?? input + output;

      return {
        message: idx + 1,
        input,
        output,
        total,
        model: message.metadata?.model,
      };
    });
}

const chartConfig = {
  input: {
    label: "Vstupní tokeny ",
    color: "var(--chart-1)",
  },
  output: {
    label: "Výstupní tokeny ",
    color: "var(--chart-2)",
  },
  total: {
    label: "Celkové tokeny ",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TokenUsageChart({ messages }: TokenUsageChartProps) {
  const data = getTokenData(messages);

  if (!data.length) return <p className="text-sm text-muted-foreground">Zatím nejsou dostupná data o spotřebě.</p>;

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="message" tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />

        <YAxis tickLine={false} axisLine={false} width={50} />

        <ChartTooltip content={<ChartTooltipContent className="min-w-48" />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Line dataKey="input" stroke="var(--color-input)" strokeWidth={2} dot />
        <Line dataKey="output" stroke="var(--color-output)" strokeWidth={2} dot />
        <Line dataKey="total" stroke="var(--color-total)" strokeWidth={2} dot />
      </LineChart>
    </ChartContainer>
  );
}
