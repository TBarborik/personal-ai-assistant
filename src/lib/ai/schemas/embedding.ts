import { z } from "zod";
import { EMBEDDING_DIMENSIONS } from "../embeddings/model";

export const embeddingSchema = z
  .array(z.number())
  .length(EMBEDDING_DIMENSIONS)
  .refine(
    (vector) => vector.some((value) => value !== 0),
    "Embedding vector must not be zero.",
  );
export type Embedding = z.infer<typeof embeddingSchema>;
