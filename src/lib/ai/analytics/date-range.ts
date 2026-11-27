import "server-only";
import { AnalyticsPeriod } from "./perios";
import { getAnalyticsDay, shiftAnalyticsDay, startOfAnalyticsDay } from "./date";
import { getFirstUsageDate } from "@/lib/db/usage";

export async function getAnalyticsDateRange(period: AnalyticsPeriod) {
  const to = new Date();
  const today = getAnalyticsDay(to);

  let firstDay: string;

  if (period === "all") {
    const firstUsage = await getFirstUsageDate();
    firstDay = firstUsage ? getAnalyticsDay(firstUsage) : today;
  } else {
    firstDay = shiftAnalyticsDay(today, -(Number(period) - 1));
  }

  return {
    to: to,
    from: startOfAnalyticsDay(firstDay),
  };
}
