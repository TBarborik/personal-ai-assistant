import "server-only";
import { type LanguageModelUsage } from "ai";
import { saveUsage } from "@/lib/db/usage";
import { normalizeUsage } from "./normalize-usage";
import { calculateCost } from "./calculate-cost";
import { Prisma } from "@/generated/prisma/client";

type ModelInfo = {
  provider: string;
  modelId: string;
};

type UsageStepData = {
  stepNumber: number;
  model: ModelInfo;
  usage: LanguageModelUsage;
  finishReason: string;
  toolCalls: readonly {
    toolName: string;
  }[];
};

type RecordUsageOptions = {
  conversationId: string;
  messageId: string;
  model: ModelInfo;
  usage: LanguageModelUsage;
  steps: readonly UsageStepData[];
  durationMs: number;
  finishReason: string;
};

export async function recordUsage(options: RecordUsageOptions) {
  const stepsData = await Promise.all(
    options.steps.map(async (step) => ({
      position: step.stepNumber,
      provider: step.model.provider,
      model: step.model.modelId,
      finishReason: step.finishReason,
      costUsd: await calculateCost(
        step.model.provider,
        step.model.modelId,
        step.usage,
      ),
      toolCalls: step.toolCalls.map((call) => call.toolName),
      ...normalizeUsage(step.usage),
    })),
  );

  let totalCost: Prisma.Decimal | null =
    stepsData.length > 0 ? Prisma.Decimal(0) : null;

  if (totalCost !== null)
    for (const step of stepsData) {
      if (step.costUsd === null) {
        totalCost = null;
        break;
      }

      totalCost = totalCost.add(step.costUsd);
    }

  return saveUsage({
    conversationId: options.conversationId,
    messageId: options.messageId,
    provider: options.model.provider,
    model: options.model.modelId,
    durationMs: options.durationMs,
    stepCount: options.steps.length,
    finishReason: options.finishReason,
    costUsd: totalCost,
    toolCallCount: options.steps.reduce(
      (acc, step) => acc + step.toolCalls.length,
      0,
    ),
    steps: {
      create: stepsData,
    },
    ...normalizeUsage(options.usage),
  });
}
