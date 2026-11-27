import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsSkeleton } from "@/components/analytics/analytics-skeleton";
import { TokenChart } from "@/components/analytics/token-chart";
import { prepareChartData } from "@/lib/ai/analytics/chart-data";
import { getDailyUsage, getUsageSummary } from "@/lib/db/usage";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                <header className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Analytika</h1>
                    <p className="text-sm text-muted-foreground">
                        Přehled provozu AI asistenta za posledních 30 dní.
                    </p>
                </header>
                <Suspense fallback={<AnalyticsSkeleton />}>
                    <AnalyticsContent />
                </Suspense>
            </div>
        </div>
    )
}

async function AnalyticsContent() {
    await connection();

    const to = new Date();
    const from = new Date(to.getTime() - 30*24*60*60*1_000)
    const [summary, dailyUsage] = await Promise.all([getUsageSummary(from, to), getDailyUsage(from, to)]);
    const chartData = prepareChartData(dailyUsage, from, to)

    return (
        <div className="space-y-6">
            <AnalyticsOverview summary={summary} />
            <TokenChart data={chartData.tokenData} />
        </div>
    )
}