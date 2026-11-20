import { z } from "zod";

export const currentWeatherResultSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number(),
  utc_offset_seconds: z.number(),
  timezone: z.string(),
  timezone_abbreviation: z.string(),
  elevation: z.number(),
  current_units: z.object({
    time: z.string(),
    interval: z.string(),
    temperature_2m: z.string(),
    relative_humidity_2m: z.string(),
    apparent_temperature: z.string(),
    snowfall: z.string(),
    showers: z.string(),
    rain: z.string(),
    precipitation: z.string(),
    weather_code: z.string(),
    cloud_cover: z.string(),
    wind_gusts_10m: z.string(),
    wind_direction_10m: z.string(),
    wind_speed_10m: z.string(),
  }),
  current: z.object({
    time: z.string(),
    interval: z.number(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    apparent_temperature: z.number(),
    snowfall: z.number(),
    showers: z.number(),
    rain: z.number(),
    precipitation: z.number(),
    weather_code: z.number(),
    cloud_cover: z.number(),
    wind_gusts_10m: z.number(),
    wind_direction_10m: z.number(),
    wind_speed_10m: z.number(),
  })
});

export type CurrentWeatherResult = z.infer<typeof currentWeatherResultSchema>;
