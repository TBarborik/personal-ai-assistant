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
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async ({ latitude, longitude }) => {
    const cachedKey = JSON.stringify({ latitude, longitude });

    const cached = currentWeatherCache.get(cachedKey);
    if (cached !== undefined) return cached;

    console.log(`${API_URL}&latitude=${latitude}&longitude=${longitude}`);

    const response = await fetch(
      `${API_URL}&latitude=${latitude}&longitude=${longitude}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Current weather search failed: ${response.status}.`);
    }

    const data = currentWeatherResultSchema.parse(await response.json());

    currentWeatherCache.set(cachedKey, data);

    return data;
  },
});
