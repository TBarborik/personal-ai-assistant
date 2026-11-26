import { formatDuration, formatNumber, formatPerc, formatUsd } from "@/lib/ai/analytics/format";
import { UsageSummary } from "@/lib/db/usage";
import { ChartNoAxesColumn, Database, MessageSquare, Timer, Wallet, Wrench } from "lucide-react";
import { describe } from "zod/v4/core";
import { MetricCard } from "./metric-card";

type AnalyticsOverviewProps = {
  summary: UsageSummary;
};

export function AnalyticsOverview({ summary }: AnalyticsOverviewProps) {
  const metrics = [
    {
      title: "Odhahované náklady",
      value: formatUsd(summary.costUsd),
      description:
        summary.pricedRequestCount === summary.requestCount
          ? "Náhlady na AI modely"
          : `Oceněno ${summary.pricedRequestCount} z ${summary.requestCount} požadavků`,
      icon: Wallet,
    },
    { title: "Požadavky", value: formatNumber(summary.requestCount), description: `${formatNumber(summary.stepCount)} modelových kroků`, icon: MessageSquare },
    {
      title: "Spotřeba tokenů",
      value: formatNumber(summary.totalTokens),
      description: `${formatNumber(summary.inputTokens)} vstupních | ${formatNumber(summary.outputTokens)} výstupních`,
      icon: ChartNoAxesColumn,
    },
    {
      title: "Průměrná doba generování",
      value: formatDuration(summary.averageDurationMs),
      description: "Všetně volání nástrojů",
      icon: Timer,
    },
    {
      title: "Volání nástrojů",
      value: formatNumber(summary.totalCallCount),
      description: `${formatNumber(summary.averageStepCount)} kroku na požadavek`,
      icon: Wrench,
    },
    {
      title: "Prompt cache",
      value: formatPerc(summary.cacheReadRate),
      description: `${formatNumber(summary.cacheReadTokens)} cachovaných tokenů`,
      icon: Database,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(metric => <MetricCard key={metric.title} {...metric} />)}
    </div>
  );
}
