import "server-only";
import { ipLocationDataCache } from "@/lib/cache/ip-location-data";
import { tool } from "ai";
import { z } from "zod";
import { ipLocationResultSchema } from "../schemas/ip-location-data";
import { getClientIp } from "@/lib/server";

const API_URL =
  "http://ip-api.com/json/{query}?fields=status,continent,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,currency,isp,org,as,query";

export const ipLocationData = tool({
  description:
    "Get user's location data like address - continent, country, lat, lon, zip, region, city - currency, timezone and other.",
  inputSchema: z.object(),
  execute: async () => {
    let ip = await getClientIp();
    if (!ip) {
      throw new Error("IP could not be determined.");
    }

    const cachedKey = JSON.stringify({
      ip: ip,
    });

    const cached = ipLocationDataCache.get(cachedKey);
    if (cached !== undefined) return cached;

    console.log(ip)
    if (["127.0.0.1", "localhost", "::ffff:127.0.0.1"].includes(ip))
      ip = "";

    const url = new URL(API_URL.replace(/\{query\}/, ip));
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Location data retrieve failed: ${response.status}.`);
    }

    const data = ipLocationResultSchema.parse(await response.json());

    if (data.status === "failed") {
      throw new Error(`Location data retrieve failed: ${response.status}.`);
    }

    ipLocationDataCache.set(cachedKey, data);

    return data;
  },
});
