import { LRUCache } from "lru-cache/raw";
import "server-only";
import { PricingCatalog, pricingCatalogSchema } from "../ai/schemas/model-pricing";

const API_URL = "https://models.dev/api.json";
const CACHE_TTL = 24 * 60 * 60 * 1_000;

export const modelPricingCache = new LRUCache<string, PricingCatalog>({
    ttl: CACHE_TTL,
    max: 1,
    noDeleteOnFetchRejection: true,
    allowStaleOnFetchRejection: true,
    fetchMethod: async() => {
        try {
            const response = await fetch(API_URL, {
                signal: AbortSignal.timeout(5_000),
                cache: "no-store"
            })

            if (!response.ok) {
                throw new Error(`Models.dev API failes: ${response.status}.`)
            }

            return pricingCatalogSchema.parse(await response.json());
        } catch (err) {
            console.error("[MODEL_PRICING_FETCH]", err);
            throw err;
        }
    }
})