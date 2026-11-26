import { LanguageModelUsage } from "ai";

export function normalizeUsage(usage: LanguageModelUsage) {
    return {
        inputTokens: usage.inputTokens ?? null,
        outputTokens: usage.outputTokens ?? null,
        totalTokens: usage.totalTokens ?? null,
        cacheReadTokens: usage.inputTokenDetails?.cacheReadTokens ?? null,
        cacheWriteTokens: usage.inputTokenDetails?.cacheWriteTokens ?? null,
        reasoningTokens: usage.outputTokenDetails?.reasoningTokens ?? null
    }
}