import { Prisma } from "@/generated/prisma/client";
import { LanguageModelUsage } from "ai";
import "server-only";
import { getModelPricing } from "./pricing";

const TOKENS_PER_UNIT = 1_000_000;

export async function calculateCost(
  provider: string,
  modelId: string,
  usage: LanguageModelUsage,
): Promise<Prisma.Decimal | null> {
  const { inputTokens, outputTokens } = usage;
  if (inputTokens === undefined || outputTokens === undefined) return null;

  const pricing = await getModelPricing(provider, modelId);
  if (!pricing) return null;

  const cacheReadTokens = usage.inputTokenDetails?.cacheReadTokens ?? 0;
  const cacheWriteTokens = usage.inputTokenDetails?.cacheWriteTokens ?? 0;
  const standartInputTokens =
    usage.inputTokenDetails?.noCacheTokens ??
    inputTokens - cacheReadTokens - cacheWriteTokens;

  if (
    standartInputTokens < 0 ||
    standartInputTokens + cacheReadTokens + cacheWriteTokens !== inputTokens
  ) {
    return null;
  }

  if (
    (cacheReadTokens > 0 && pricing.cache_read === undefined) ||
    (cacheWriteTokens > 0 && pricing.cache_write === undefined)
  ) {
    return null;
  }

  const reasoningTokens = usage.outputTokenDetails?.reasoningTokens ?? 0;
  if (reasoningTokens > outputTokens) return null;

  const standardOutputTokens =
    pricing.reasoning !== undefined
      ? outputTokens - reasoningTokens
      : outputTokens;

  return new Prisma.Decimal(standartInputTokens)
    .mul(pricing.input)
    .plus(new Prisma.Decimal(cacheReadTokens).mul(pricing.cache_read ?? 0))
    .plus(new Prisma.Decimal(cacheWriteTokens).mul(pricing.cache_write ?? 0))
    .plus(new Prisma.Decimal(standardOutputTokens).mul(pricing.output ?? 0))
    .plus(new Prisma.Decimal(reasoningTokens).mul(pricing.reasoning ?? 0))
    .div(TOKENS_PER_UNIT)
    .toDecimalPlaces(10);
}
