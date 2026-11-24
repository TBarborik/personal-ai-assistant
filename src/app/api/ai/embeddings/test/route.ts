import {
  generateEmbedding,
  generateEmbeddings,
} from "@/lib/ai/embeddings/embeddings";
import { cosineSimilarity } from "ai";

export async function GET() {
  if (process.env.NODE_ENV !== "development")
    return Response.json(null, { status: 404 });

  const start = performance.now();

  const query = "Jak funguje autentizace uživatele?";
  const passages = [
    "Autentizace uživatele pomocí JWT tokenu.",
    "User authentication using JWT tokens.",
    "Recept na italské rizoto.",
    "Border kolie je velmi inteligentní pes.",
    "Next.js podporuje React Server Components.",
  ];

  const queryEmbedding = await generateEmbedding(query, "query");
  const passageEmbeddings = await generateEmbeddings(passages, "query");

  const results = passages
    .map((text, idx) => ({
      text: text,
      similarity: cosineSimilarity(queryEmbedding, passageEmbeddings[idx]),
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return Response.json({
    modelDimensions: queryEmbedding.length,
    durationMs: Math.round(performance.now() - start),
    query: query,
    results: results,
  });
}
