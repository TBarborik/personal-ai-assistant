import {
  CITATION_SYSTEM_PROMPT,
  DOCUMENT_SYSTEM_PROMPT,
  ERROR_SYSTEM_PROMPT,
  GENERAL_SYSTEM_PROMPT,
  models,
  requestSchema,
} from "@/lib/ai/models";
import { tools } from "@/lib/ai/tools";
import { createLimitedWebSearch } from "@/lib/ai/tools/web-search";
import { saveMessage } from "@/lib/db/messages";
import { prisma } from "@/lib/db/prisma";
import {
  consumeStream,
  convertToModelMessages,
  createUIMessageStreamResponse,
  pruneMessages,
  stepCountIs,
  streamText,
  toUIMessageStream,
  validateUIMessages,
} from "ai";

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json(
      {
        error: "Neplatný požadavek.",
      },
      { status: 400 },
    );
  }

  const { model, messages, conversationId } = parsed.data;

  if (!(model in models)) {
    return Response.json(
      {
        error: "Neplatně zvolený model.",
      },
      { status: 400 },
    );
  }

  const validatedMessages = await validateUIMessages({ messages });
  const lastMessage = validatedMessages.at(-1);

  if (!lastMessage || lastMessage.role !== "user") {
    return Response.json(
      { error: "Chybí uživatelská zpráva." },
      { status: 400 },
    );
  }

  const firstText = lastMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  await prisma.conversation.upsert({
    where: { id: conversationId },
    create: {
      id: conversationId,
      title: firstText.slice(0, 100) || "Nová konverzace",
    },
    update: {},
  });

  await saveMessage(conversationId, lastMessage);

  const result = streamText({
    model: models[model],
    messages: pruneMessages({
      messages: await convertToModelMessages(validatedMessages),
      reasoning: "all",
    }),
    maxOutputTokens: 5_000,
    instructions: `
      ${GENERAL_SYSTEM_PROMPT.replaceAll("{{model}}", models[model].modelId)}
      ${ERROR_SYSTEM_PROMPT}
      ${DOCUMENT_SYSTEM_PROMPT}
      ${CITATION_SYSTEM_PROMPT}
    `,
    tools: {
      ...tools,
      webSearch: createLimitedWebSearch(2),
    },
    stopWhen: stepCountIs(3),
    prepareStep: ({ stepNumber }) => {
      if (stepNumber === 2) {
        return {
          activeTools: [],
          toolChoice: "none",
        };
      }
    },
    onStepEnd: ({
      stepNumber,
      finishReason,
      usage,
      toolCalls,
      toolResults,
    }) => {
      if (process.env.NODE_ENV !== "development") return;

      //console.log("[AGENT]", {
      //  step: stepNumber + 1,
      //  finishReason,
      //  usage,
      //  tools: toolCalls.map((call) => call.toolName),
      //  toolResultChars: JSON.stringify(toolResults).length,
      //});
    },
    onEnd: ({ usage, steps }) => {
      if (process.env.NODE_ENV !== "development") return;
      
      //console.log("[TOTAL]", {
      //  steps: steps.length,
      //  inputTokens: usage.inputTokens,
      //  outputTokens: usage.outputTokens,
      //  totalTokens: usage.totalTokens,
      //})
    },
    onError: ({ error }) => {
      //console.log("[AI STREAM ERROR]", error);
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      originalMessages: validatedMessages,
      generateMessageId: () => crypto.randomUUID(),
      messageMetadata: ({ part }) => {
        if (part.type === "finish")
          return { usage: part.totalUsage, model: model };
      },
      onEnd: async ({ responseMessage, isAborted, finishReason }) => {
        if (!isAborted && finishReason !== "error")
          await saveMessage(conversationId, responseMessage);
      },
    }),
    consumeSseStream: consumeStream,
  });
}
