import "server-only";
import { ModelPricing, modelPricingSchema } from "../schemas/model-pricing";
import { modelPricingCache } from "@/lib/cache/model-pricing";

export async function getModelPricing(provider: string, modelId: string): Promise<ModelPricing | null> {
    const providerId = provider.split(".")[0];
    const catalog = await modelPricingCache.fetch("catalog");
    const cost = catalog?.[providerId]?.models[modelId]?.cost;
    const parsed = modelPricingSchema.safeParse(cost);

    if (!parsed.success) {
        console.warn("[MODEL PRICING NOT FOUND]", {provider: providerId, modelId: modelId});
        return null;
    }

    return parsed.data;
}