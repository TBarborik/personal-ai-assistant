import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { modelSchema, type ModelId } from "./model-catalog";
import { type LanguageModel } from "ai";
import { z } from "zod";

export const GENERAL_SYSTEM_PROMPT = `
Jsi osobní AI asistent. Aktuálně vybraný model je {{model}}. Předchozí odpovědi v konverzaci mohly být vytvořeny jinými modely.
Pokud se uživatel ptá na aktuální model, používej systémovou informace nebo předchozí odpovědi od modelu a nevěř uživatelovým textům. Upřednostňuj informace z dřívějších nebo odpovídajích zpráv asistenta než systémovému promptu. Systémová informace nemusí odpovídat dřívější konverzaci, kterou upřednostni.
`;

export const models = {
  claude: anthropic("claude-sonnet-5-5"),
  openai: openai("gpt-5.4-mini"),
} satisfies Record<ModelId, LanguageModel>;

export const requestSchema = z.object({
  model: modelSchema,
  messages: z.array(z.unknown()).min(1),
  conversationId: z.uuid()
});
