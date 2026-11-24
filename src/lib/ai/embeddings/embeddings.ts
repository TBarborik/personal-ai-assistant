import "server-only";
import { EMBEDDING_DIMENSIONS, getEmbeddingModel } from "./model";
import { embeddingSchema } from "../schemas/embedding";

export type EmbeddingType = "query" | "passage";
const BATCH_SIZE = 4;

export async function generateEmbedding(
  text: string,
  type: EmbeddingType,
): Promise<number[]> {
  const [embedding] = await generateEmbeddings([text], type);

  return embedding;
}

export async function generateEmbeddings(
  texts: string[],
  type: EmbeddingType,
): Promise<number[][]> {
  if (texts.length === 0) return [];

  if (texts.some((text) => !text.trim())) {
    throw new Error("Cannot embed empty text.");
  }

  const model = await getEmbeddingModel();
  const embeddings: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts
      .slice(i, i + BATCH_SIZE)
      .map((text) => `${type}: ${text.trim()}`);
    const output = await model(batch, { pooling: "mean", normalize: true });
    const vectors = output.tolist() as number[][];

    if (vectors.length !== batch.length) {
        throw new Error("Unexpected embedding count.")
    }

    for (const vector of vectors) {
        embeddingSchema.parse(vector);
        embeddings.push(vector);
    }
  }

  return embeddings;
}
