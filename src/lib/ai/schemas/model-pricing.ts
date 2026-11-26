import { z } from "zod";

export const modelPricingSchema = z
  .object({
    input: z.number().nonnegative(),
    output: z.number().nonnegative(),
    cache_write: z.number().nonnegative().optional(),
    cache_read: z.number().nonnegative().optional(),
    reasoning: z.number().nonnegative().optional(),
  })
  .loose();

export const pricingCatalogSchema = z.record(
  z.string(),
  z.object({
    models: z.record(
      z.string(),
      z.object({
        cost: z.unknown().optional(),
      }),
    ),
  }),
);

export type ModelPricing = z.infer<typeof modelPricingSchema>;
export type PricingCatalog = z.infer<typeof pricingCatalogSchema>;