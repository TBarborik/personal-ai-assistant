import { getChunkEmbeddings, getChunksByIds } from "@/lib/db/storage";
import { generateEmbedding } from "../embeddings/embeddings";
import { EMBEDDING_MODEL_VERSION } from "../embeddings/model";
import { RAG_CONFIG } from "@/lib/ai/rag/config";
import { embeddingSchema } from "../schemas/embedding";
import { cosineSimilarity } from "ai";
import { type DocumentSearchResults } from "../schemas/document-search";

type ScoredChunk = {
  id: string;
  similarity: number;
};

export async function searchDocuments(query: string): Promise<DocumentSearchResults> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) return [];

  const queryEmbedding = await generateEmbedding(query, "query");
  const candidates: ScoredChunk[] = [];
  let afterId: string | undefined;

  while (true) {
    const batch = await getChunkEmbeddings(
      EMBEDDING_MODEL_VERSION,
      RAG_CONFIG.batchSize,
      afterId,
    );
    if (batch.length === 0) break;

    for (const chunk of batch) {
      const parsed = embeddingSchema.safeParse(chunk.embedding);

      if (!parsed.success) {
        continue;
      }

      const similarity = cosineSimilarity(queryEmbedding, parsed.data);
      if (similarity < RAG_CONFIG.minSimilarity) {
        continue;
      }

      candidates.push({
        id: chunk.id,
        similarity: similarity,
      });
    }

    candidates
      .sort((a, b) => b.similarity - a.similarity)
      .splice(RAG_CONFIG.topK);

    afterId = batch[batch.length - 1].id;

    if (batch.length < RAG_CONFIG.batchSize) break;
  }

  if (candidates.length === 0) return [];

  const chunks = await getChunksByIds(
    candidates.map((cnd) => cnd.id),
    EMBEDDING_MODEL_VERSION,
  );

  const chunkMap = new Map(chunks.map((chunk) => [chunk.id, chunk]));

  return candidates.flatMap((cnd) => {
    const chunk = chunkMap.get(cnd.id);
    if (!chunk) return [];

    return [
      {
        chunkId: chunk.id,
        documentId: chunk.documentId,
        documentName: chunk.document.name,
        position: chunk.position,
        content: chunk.content,
        similarity: cnd.similarity,
      },
    ];
  });
}

export type DocumentSearchResult = Awaited<ReturnType<typeof searchDocuments>>[number]
