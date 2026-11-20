import { tool } from "ai";
import { z } from "zod";

export const getCurrentTime = tool({
  description:
    "Get the current date and time in specified IANA timezone. Use this tool for questions about the current time, date or day of the week.",
  inputSchema: z.object({
    timezone: z
      .string()
      .default("Europe/Prague")
      .describe(
        "IANA timezone, for example Europe/Prague, Asia/Tokyo or America/New_York",
      ),
  }),
  execute: async ({ timezone }) => {
    const now = new Date();

    try {
      const formatter = new Intl.DateTimeFormat("cs-CZ", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "medium",
      });

      return {
        formatted: formatter.format(now),
        timestamp: now.toISOString(),
        timezone: timezone,
      };
    } catch {
      return {
        error: `Neplatné časové pásmo {timezone}.`,
      };
    }
  },
});
