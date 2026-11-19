import { getConversation } from "@/lib/db/conversations";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const conversation = await getConversation(id);

  if (!conversation) {
    return Response.json({ error: "Konverzace neexistuje." }, { status: 404 });
  }

  return Response.json(conversation);
}
