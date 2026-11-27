import { z } from "zod";

export const analyticsPeriods = {
  "7": "Posledních 7 dní",
  "30": "Posledních 30 dní",
  "90": "Posledních 90 dní",
  all: "Celá historie",
} as const;

export type AnalyticsPeriod = keyof typeof analyticsPeriods;

export const analyticsPeriosSchema = z.enum(Object.keys(analyticsPeriods) as AnalyticsPeriod[]);

export const parseAnalyticsPeriod = (value: unknown): AnalyticsPeriod => analyticsPeriosSchema.catch("30").parse(value);
