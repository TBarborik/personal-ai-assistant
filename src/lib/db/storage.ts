import "server-only";
import { prisma } from "./prisma";
import { getFileType } from "../documents/storage";
import { TextChunk } from "../documents/chunk-text";
import { EmbeddedChunk } from "../documents/embed-chunks";

export async function createDocument(file: File, storageKey: string) {
  return prisma.document.create({
    data: {
      name: file.name,
      storageKey: storageKey,
      mimeType: (await getFileType(file))?.mime ?? "application/octet-stream",
      size: file.size,
    },
  });
}

export async function getDocuments() {
  return prisma.document.findMany({
    select: {
      id: true,
      name: true,
      size: true,
      mimeType: true,
      status: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          chunks: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteDocument(id: string) {
  const document = await prisma.document.findFirstOrThrow({
    where: { id },
    select: { id: true, storageKey: true },
  });
  await prisma.document.delete({ where: { id } });

  return document;
}

export async function saveProcessedDocument(
  id: string,
  content: string,
  chunks: EmbeddedChunk[],
) {
  return prisma.$transaction(async (tx) => {
    await tx.documentChunk.deleteMany({ where: { documentId: id } });
    await tx.documentChunk.createMany({
      data: chunks.map((chunk) => ({
        documentId: id,
        position: chunk.position,
        content: chunk.content,
        embedding: chunk.embedding,
        embeddingModel: chunk.embeddingModel,
      })),
    });
    return tx.document.update({
      where: { id: id },
      data: {
        content: content,
        status: "READY",
        errorMessage: null,
        indexedAt: new Date(),
      },
    });
  });
}

export async function getChunkEmbeddings(embeddingModel: string, take: number, afterId?: string) {
  return prisma.documentChunk.findMany({
    where: {
      embeddingModel: embeddingModel,
      document: {
        status: "READY"
      },
      ...(afterId ? {id: {gt: afterId}} : {})
    },
    select: {
      id: true,
      embedding: true
    },
    orderBy: {
      id: "asc"
    },
    take
  })
}

export async function getChunksByIds(ids: string[], embeddingModel: string) {
  return prisma.documentChunk.findMany({
    where: {
      id: {in: ids},
      embeddingModel: embeddingModel,
      document: {
        status: "READY"
      }
    },
    select: {
      id: true,
      documentId: true,
      position: true,
      content: true,
      document: {
        select: {
          name: true
        }
      }
    }
  })
}

export type DocumentListItem = Awaited<ReturnType<typeof getDocuments>>[number];
