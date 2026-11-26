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

export type UsageSummary = Awaited<ReturnType<typeof getUsageSummary>>;
