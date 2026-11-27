import { Prisma } from "@/generated/prisma/client";
import "server-only";
import { prisma } from "./prisma";

export async function saveUsage(data: Prisma.UsageCreateInput) {
  return prisma.usage.create({
    data: data,
    select: {
      id: true,
    },
  });
}

export async function getUsageSummary(from: Date, to: Date) {
  const result = await prisma.usage.aggregate({
    where: {
      createdAt: {
        gte: from,
        lt: to,
      },
    },
    _count: {
      _all: true,
      costUsd: true,
      inputTokens: true,
      cacheReadTokens: true,
    },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalTokens: true,
      cacheReadTokens: true,
      cacheWriteTokens: true,
      reasoningTokens: true,
      stepCount: true,
      toolCallCount: true,
      costUsd: true,
    },
    _avg: {
      durationMs: true,
      stepCount: true,
    },
  });

  return {
    requestCount: result._count._all,
    pricedRequestCount: result._count.costUsd,
    inputTokens: result._sum.inputTokens,
    outputTokens: result._sum.outputTokens,
    totalTokens: result._sum.totalTokens,
    cacheReadTokens: result._sum.cacheReadTokens,
    cacheWriteTokens: result._sum.cacheWriteTokens,
    reasoningTokens: result._sum.reasoningTokens,
    cacheReadRate:
      result._count._all > 0 &&
      result._count.cacheReadTokens === result._count._all &&
      result._count.inputTokens === result._count._all &&
      result._sum.inputTokens &&
      result._sum.cacheReadTokens !== null
        ? result._sum.cacheReadTokens / result._sum.inputTokens
        : null,
    stepCount: result._sum.stepCount ?? 0,
    totalCallCount: result._sum.toolCallCount ?? 0,
    costUsd: result._sum.costUsd?.toString() ?? null,
    averageDurationMs: result._avg.durationMs,
    averageStepCount: result._avg.stepCount,
  };
}

type DailyUsageRow = {
  day: string;
  provider: string;
  requestCount: bigint;
  pricedRequestCount: bigint;
  inputTokens: Prisma.Decimal | null;
  outputTokens: Prisma.Decimal | null;
  costUsd: Prisma.Decimal | null;
};

export async function getDailyUsage(from: Date, to: Date) {
  const rows = await prisma.$queryRaw<DailyUsageRow[]>`
      SELECT DATE_FORMAT(createdAt, '%Y-%m-%d') as day, SUBSTRING_INDEX(provider, '.', 1) AS provider, COUNT(*) as requestCount, COUNT(costUsd) as pricedRequestCount, SUM(inputTokens) as inputTokens, SUM(outputTokens) as outputTokens, SUM(costUsd) as costUsd
      FROM \`Usage\`
      WHERE createdAt >= ${from} AND createdAt < ${to}
      GROUP BY DATE_FORMAT(createdAt, '%Y-%m-%d'), SUBSTRING_INDEX(provider, '.', 1)
      ORDER BY day ASC
    `;

  return rows.map((row) => ({
    day: row.day,
    provider: row.provider,
    requestCount: Number(row.requestCount),
    pricedRequestCount: Number(row.pricedRequestCount),
    inputTokens: row.inputTokens === null ? null : Number(row.inputTokens),
    outputTokens: row.outputTokens === null ? null : Number(row.outputTokens),
    costUsd: row.costUsd?.toString() ?? null,
  }));
}

export type UsageSummary = Awaited<ReturnType<typeof getUsageSummary>>;
export type DailyUsage = Awaited<ReturnType<typeof getDailyUsage>>;
