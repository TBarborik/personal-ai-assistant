import { modelSchema } from "@/lib/ai/model-catalog";
import { models } from "@/lib/ai/models";
import { generateText } from "ai";
import { z } from "zod";

const requestSchema = z.object({
  model: modelSchema,
  prompt: z.string().trim().min(1).max(2_000),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Neplatný JSON." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Neplatná vstupní data.", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }

  const { model, prompt } = parsed.data;
  try {
    const result = await generateText({
      model: models[model],
      prompt: prompt,
      abortSignal: AbortSignal.timeout(30_000),
      maxOutputTokens: 500,
    });

    return Response.json({
      model: model,
      text: result.text,
      usage: {
        input: result.usage.inputTokens,
        output: result.usage.outputTokens,
        total: result.usage.totalTokens,
      },
    });
  } catch (err) {
    console.error("AI generation failed: ", err);
    return Response.json(
      { error: "Nepodařilo se vygenerovat odpověď." },
      { status: 502 },
    );
  }
}
