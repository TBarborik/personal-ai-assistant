import { WebSearchResults, webSearchResultsSchema } from "@/lib/ai/schemas/web-search";
import { searchCache } from "@/lib/cache/search";
import { formatTextToNormalize } from "@/lib/format";
import { tool } from "ai";
import "server-only";
import { z } from "zod";

const MAX_RESULTS = 5;
const DEPTH = "basic";

const searchResponseSchema = z.object({
  results: webSearchResultsSchema
});

export const webSearch = tool({
  description:
    "Search the public web for current information. Use when the answer requires recent or externally verified facts.",
  inputSchema: z.object({
    query: z.string().min(3).max(300),
  }),
  execute: async ({ query }) => {
    const normalizedQuery = formatTextToNormalize(query);
    const cachedKey = JSON.stringify({
        query: normalizedQuery,
        depth: DEPTH,
        maxResults: MAX_RESULTS
    });

    const cached = searchCache.get(cachedKey)
    if (cached !== undefined)
        return cached;

    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
        throw new Error("TAVILY_API_KEY is missing.")
    }

    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query, search_septh: DEPTH, max_results: MAX_RESULTS, include_answer: false, include_raw_content: false
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store"
    })

    if (!response.ok) {
        throw new Error(`Tavily search failed: ${response.status}.`)
    }

    const data = prepareSearchResults(searchResponseSchema.parse(await response.json()).results)

    searchCache.set(cachedKey, data)

    return data;
  },
});

export function createLimitedWebSearch(maxWebSearchCalls: number) {
  let calls = 0;

  return {
    ...webSearch,
    execute: async(...args: Parameters<NonNullable<typeof webSearch.execute>>) => {
      if (calls >= maxWebSearchCalls) {
        throw new Error("Web Search limit reached for this request.")
      }

      calls++;
      return webSearch.execute!(...args)
    }
  }
}

function prepareSearchResults(results: WebSearchResults): WebSearchResults {
  return results.slice(0, MAX_RESULTS).map((result) => ({
    ...result,
    content: result.content.slice(0, 500)
  }))
}