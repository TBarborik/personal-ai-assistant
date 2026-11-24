import { z } from "zod";

export const documentSearchResultScheme = z.object({
    chunkId: z.string(),
    documentId: z.string(),
    documentName: z.string(),
    position: z.number().int().nonnegative(),
    content: z.string(),
    similarity: z.number()
})

export const documentSearchResultsScheme = z.array(documentSearchResultScheme)

export type DocumentSearchResult = z.infer<typeof documentSearchResultScheme>;
export type DocumentSearchResults = z.infer<typeof documentSearchResultsScheme>;