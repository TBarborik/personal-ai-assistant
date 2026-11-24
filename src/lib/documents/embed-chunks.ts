import { generateEmbeddings } from "../ai/embeddings/embeddings";
import { EMBEDDING_MODEL_VERSION } from "../ai/embeddings/model";
import { TextChunk } from "./chunk-text";

export type EmbeddedChunk = TextChunk & {
    embedding: number[];
    embeddingModel: string;
}

export async function embedChunks(chunks:TextChunk[]): Promise<EmbeddedChunk[]> {
    const embeddings = await generateEmbeddings(chunks.map(chunk => chunk.content), "passage");

    return chunks.map((chunk, idx) => ({...chunk, embedding: embeddings[idx], embeddingModel: EMBEDDING_MODEL_VERSION}))
}