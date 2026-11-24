import "server-only";
import { tool } from "ai";
import {z} from "zod";
import { searchDocuments as search } from "../rag/search";

export const searchDocuments = tool({
    description: `
        Search the user's personal document library using semantic search. Use this tool when user asks about uploaded documents, personal notes, technical documentation or information potentially stored in their knowledge base.
        Results cotain relevant document excerpts, document names, chunk positions and similarity scores.
    `,
    inputSchema: z.object({
        query: z.string().trim().min(1).max(1_000).describe("Semantic search query for finding relevant document excerpts.")
    }),
    execute: async({query}) => {
        return search(query);
    }
})