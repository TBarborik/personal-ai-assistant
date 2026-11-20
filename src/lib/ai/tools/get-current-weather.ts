import { currentWeatherCache } from "@/lib/cache/current-weather";
import { tool } from "ai";
import "server-only";
import { z } from "zod";
import { currentWeatherResultSchema } from "../schemas/current-weather";

const API_URL =
  "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,apparent_temperature,snowfall,showers,rain,precipitation,weather_code,cloud_cover,wind_gusts_10m,wind_direction_10m,wind_speed_10m";

export const currentWeather = tool({
  description:
    "Get weather info based on latitude and longitude from open-meteo.com.",
  inputSchema: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  execute: async ({ latitude, longitude }) => {
    const cachedKey = JSON.stringify({
      latitude: latitude.toFixed(3),
      longitude: longitude.toFixed(3),
    });

    const cached = currentWeatherCache.get(cachedKey);
    if (cached !== undefined) return cached;

    const url = new URL(API_URL);
    url.searchParams.set("latitude", latitude.toString());
    url.searchParams.set("longitude", longitude.toString());

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Current weather search failed: ${response.status}.`);
    }

    const data = currentWeatherResultSchema.parse(await response.json());

    currentWeatherCache.set(cachedKey, data);

    return data;
  },
});
