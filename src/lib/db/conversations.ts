import "server-only";
import { prisma } from "./prisma";
import { metadata } from "@/app/layout";
import { validateUIMessages } from "ai";
import { AppUIMessage } from "../ai/types";

export async function createConversation(title: string = "Nová konverzace") {
  return prisma.conversation.create({
    data: { title },
  });
}

export async function getConversation(id: string) {
  return prisma.conversation.findUnique({
    where: { id: id },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getConversationMessages(id: string) {
    const conversation = await getConversation(id);

    if (!conversation)
        return null;

    const messages = conversation.messages.map((message) => ({
        id: message.id,
        role: message.role,
        parts: message.parts,
        metadata: message.metadata ?? undefined
    }));

    return validateUIMessages<AppUIMessage>({
        messages: messages
    })
}


export async function listConversations() {
    return prisma.conversation.findMany({
        select: {
            id: true,
            title: true,
            updatedAt: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    })
}