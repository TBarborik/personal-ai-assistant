import "server-only";
import { LRUCache } from "lru-cache";
import { CurrentWeatherResult } from "../ai/schemas/current-weather";

export const currentWeatherCache = new LRUCache<string, CurrentWeatherResult>({
    max: 200,
    ttl: 1_000 * 60 * 30
})