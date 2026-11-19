import {z} from "zod"

export const modelCatalog = {
    claude: {
        label: "Claude",
        provider: "anthropic"
    },
    openai: {
        label: "GPT",
        provider: "openai"
    }
}

export type ModelId = keyof typeof modelCatalog

export const modelSchema = z.enum(
    Object.keys(modelCatalog) as [ModelId, ...ModelId[]]
)