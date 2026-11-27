import { AnalyticsPeriod, analyticsPeriods } from "@/lib/ai/analytics/perios";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

type PeriodFilterProps = {
  period: AnalyticsPeriod;
};

export function PeriodFilter({ period }: PeriodFilterProps) {
  const periods = Object.keys(analyticsPeriods) as AnalyticsPeriod[];

  return (
    <nav aria-label="Časové období analytiky" className="flex flex-wrap gap-1">
      {periods.map((val) => (
        <Link
          key={val}
          href={`/analytics?period=${val}`}
          scroll={false}
          aria-current={period === val ? "page" : undefined}
          className={buttonVariants({
            variant: period === val ? "default" : "outline",
            size: "sm",
          })}
        >
          {val === "all" ? "Vše" : `${val} dní`}
        </Link>
      ))}
    </nav>
  );
}
