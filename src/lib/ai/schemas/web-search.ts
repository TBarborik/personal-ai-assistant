import { z } from "zod";

export const webSearchResultSchema = z.object({
  url: z.string(),
  title: z.string(),
  content: z.string(),
});

export const webSearchResultsSchema = z.array(webSearchResultSchema);

export type WebSearchResult = z.infer<typeof webSearchResultSchema>;
export type WebSearchResults = z.infer<typeof webSearchResultsSchema>;
