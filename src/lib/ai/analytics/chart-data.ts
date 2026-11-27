import { DailyUsage } from "@/lib/db/usage";

export function prepareChartData(rows: DailyUsage, from: Date, to: Date) {
  const providers = Array.from(new Set(rows.map((row) => row.provider))).sort();
  const days = new Map<string, { day: string; input: number | null; output: number | null; costs: Record<string, number | null> }>();

  const cursor = new Date(from);
  cursor.setUTCHours(0, 0, 0, 0);

  while (cursor < to) {
    const day = cursor.toISOString().slice(0, 10);
    days.set(day, {
      day: day,
      input: 0,
      output: 0,
      costs: Object.fromEntries(providers.map((provider) => [provider, 0])),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  for (const row of rows) {
    const day = days.get(row.day);

    if (!day) continue;

    day.input = day.input === null || row.inputTokens === null ? null : day.input + row.inputTokens;
    day.output = day.output === null || row.outputTokens === null ? null : day.output + row.outputTokens;
    day.costs[row.provider] = row.costUsd === null ? null : Number(row.costUsd);
  }

  const values = Array.from(days.values());

  return {
    providers,
    tokenData: values.map(({ day, input, output }) => ({
      day,
      input,
      output,
    })),
    costData: values.map(({ day, costs }) => ({
      day,
      ...costs,
    })),
    hasUnpricedRequests: rows.some((row) => row.pricedRequestCount < row.requestCount),
  };
}

export type AnalyticsChartData = ReturnType<typeof prepareChartData>;
