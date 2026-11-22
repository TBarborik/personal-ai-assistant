import "server-only";
import { headers } from "next/headers";

export async function getClientIp(): Promise<string | null> {
  const h = await headers();

  const xff = h.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0].trim();
  }

  const ip = h.get("x-real-ip");

  return ip?.startsWith("::ffff:") ? ip?.slice(7) : ip;
}
