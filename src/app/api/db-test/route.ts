import { createConversation } from "@/lib/db/conversations";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  if (process.env.NODE_ENV !== "development")
    return new Response(null, { status: 404 });

  const conversation = await createConversation();

  return Response.json({
    connected: true,
    conversation
  })
}
