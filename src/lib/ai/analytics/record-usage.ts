import "server-only";
import { type LanguageModelUsage } from "ai";
import { saveUsage } from "@/lib/db/usage";
import { normalizeUsage } from "./normalize-usage";

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
  return saveUsage({
    conversationId: options.conversationId,
    messageId: options.messageId,
    provider: options.model.provider,
    model: options.model.modelId,
    durationMs: options.durationMs,
    stepCount: options.steps.length,
    finishReason: options.finishReason,
    toolCallCount: options.steps.reduce(
      (acc, step) => acc + step.toolCalls.length,
      0,
    ),
    steps: {
      create: options.steps.map((step) => ({
        position: step.stepNumber,
        provider: step.model.provider,
        model: step.model.modelId,
        finishReason: step.finishReason,
        toolCalls: step.toolCalls.map((call) => call.toolName),
        ...normalizeUsage(step.usage),
      })),
    },
    ...normalizeUsage(options.usage),
  });
}
