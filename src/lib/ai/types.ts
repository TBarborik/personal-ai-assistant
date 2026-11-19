import { LanguageModelUsage, UIMessage } from "ai"
import { ModelId } from "./model-catalog";

export type ChatMetadata = {
    usage?: LanguageModelUsage;
    model?: ModelId
}

export type AppUIMessage = UIMessage<ChatMetadata>