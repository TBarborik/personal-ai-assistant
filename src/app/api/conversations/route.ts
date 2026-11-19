import { listConversations } from "@/lib/db/conversations";

export async function GET() {
  const conversations = await listConversations();

  return Response.json(conversations);
}
