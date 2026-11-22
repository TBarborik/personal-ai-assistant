import "server-only";
import { LRUCache } from "lru-cache";
import { IpLocationResult } from "../ai/schemas/ip-location-data";

export const ipLocationDataCache = new LRUCache<string, IpLocationResult>({
    max: 200,
    ttl: 1_000 * 60 * 60 * 24
})