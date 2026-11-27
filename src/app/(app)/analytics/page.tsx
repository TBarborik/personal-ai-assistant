import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton";
import { CostChart } from "@/components/analytics/cost-chart";
import { ModelUsageTable } from "@/components/analytics/model-usage-table";
import { PeriodFilter } from "@/components/analytics/period-filter";
import { TokenChart } from "@/components/analytics/token-chart";
import { ToolUsageChart } from "@/components/analytics/tool-usage-chart";
import { prepareChartData } from "@/lib/ai/analytics/chart-data";
import { getAnalyticsDateRange } from "@/lib/ai/analytics/date-range";
import { analyticsPeriods, parseAnalyticsPeriod } from "@/lib/ai/analytics/perios";
import { getDailyUsage, getModelUsage, getToolUsage, getUsageSummary } from "@/lib/db/usage";
import { connection } from "next/server";
import { Suspense } from "react";

type AnalyticsPageProps = PageProps<"/analytics">;

export default function Page({ searchParams }: AnalyticsPageProps) {
  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
        <Suspense fallback={<AnalyticsSkeleton />}>
          <AnalyticsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function AnalyticsContent({ searchParams }: Pick<AnalyticsPageProps, "searchParams">) {
  await connection();
  const params = await searchParams;
  const period = parseAnalyticsPeriod(params.period);
  const { from, to } = await getAnalyticsDateRange(period);

  const [summary, dailyUsage, modelUsage, toolUsage] = await Promise.all([
    getUsageSummary(from, to),
    getDailyUsage(from, to),
    getModelUsage(from, to),
    getToolUsage(from, to),
  ]);

  const chartData = prepareChartData(dailyUsage, from, to);

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="spece-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Analytika</h1>
          <p className="text-sm text-muted-foreground">{analyticsPeriods[period]}</p>
        </div>
        <PeriodFilter period={period} />
      </header>
      <div className="space-y-6">
        <AnalyticsOverview summary={summary} />
        <TokenChart data={chartData.tokenData} />
        <CostChart data={chartData.costData} providers={chartData.providers} hasUnpricedRequests={chartData.hasUnpricedRequests} />
        <ModelUsageTable data={modelUsage} />
        <ToolUsageChart data={toolUsage} />
      </div>
    </>
  );
}
