import { type UIMessage } from "ai";
import "server-only";
import { prisma } from "./prisma";
import { type Prisma } from "@/generated/prisma/client";

export async function saveMessage(conversationId: string, message: UIMessage) {
  if (!message.id?.trim()) throw new Error("Message ID cannot be empty.");

  return prisma.$transaction(async (tx) => {
    const saved = await tx.message.upsert({
      where: {
        conversationId_id: {
          conversationId: conversationId,
          id: message.id,
        },
      },
      create: {
        id: message.id,
        conversationId: conversationId,
        role: message.role,
        parts: message.parts as Prisma.InputJsonValue,
        metadata: message.metadata
          ? (message.metadata as Prisma.InputJsonValue)
          : undefined,
      },
      update: {
        parts: message.parts as Prisma.InputJsonValue,
        metadata: message.metadata
          ? (message.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    });

    await tx.conversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
      },
    });

    return saved;
  });
}
