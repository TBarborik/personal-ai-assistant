import "server-only";
import { prisma } from "../db/prisma";
import { readStoredDocument } from "./storage";
import { extractText } from "./extract-text";
import { chunkText } from "./chunk-text";
import { saveProcessedDocument } from "../db/storage";
import { embedChunks } from "./embed-chunks";

export async function processDocument(id: string) {
  const document = await prisma.document.findUniqueOrThrow({ where: { id } });

  await prisma.document.update({
    where: { id },
    data: {
      status: "PROCESSING",
      errorMessage: null
    },
  });

  try {
    const buffer = await readStoredDocument(document.storageKey);
    const content = await extractText(buffer, document.mimeType);

    if (!content) {
      throw new Error("Document contains no text.");
    }

    const chunks = chunkText(content);
    if (chunks.length === 0) {
        throw new Error("Document contains no valid chunks.")
    }

    const embeddedChunk = await embedChunks(chunks);

    return await saveProcessedDocument(id, content, embeddedChunk);
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Unknown document processing error.";
    return prisma.document.update({
      where: { id },
      data: {
        status: "FAILED",
        content: null,
        errorMessage: msg.slice(0, 1_000),
      },
    });
  }
}
