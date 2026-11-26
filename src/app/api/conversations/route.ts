import { listConversations } from "@/lib/db/conversations";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.has("limit") && typeof searchParams.get("limit") === "string" ? Number.parseInt(searchParams.get("limit") as string) : null
  const conversations = await listConversations(limit);

  return Response.json(conversations);
}
