import { LRUCache } from "lru-cache";
import "server-only";
import { WebSearchResults } from "../ai/schemas/web-search";

export const searchCache = new LRUCache<string, WebSearchResults>({
    max: 200,
    ttl: 1_000 * 60 * 30
})