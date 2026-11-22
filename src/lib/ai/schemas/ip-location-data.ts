import { z } from "zod";

export const ipLocationResultSchema = z.object({
  status: z.string(),
  query: z.string(),
  continent: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  region: z.string().optional(),
  regionName: z.string().optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  zip: z.string().optional(),
  lat: z.number().optional(),
  lon: z.number().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  isp: z.string().optional(),
  org: z.string().optional(),
});

export type IpLocationResult = z.infer<typeof ipLocationResultSchema>;
