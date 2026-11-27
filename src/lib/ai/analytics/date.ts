export const ANALYTICS_TIME_ZONE = "Europe/Prague";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: ANALYTICS_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const offsetFormatter = new Intl.DateTimeFormat("en", {
  timeZone: ANALYTICS_TIME_ZONE,
  timeZoneName: "longOffset",
});

export function getAnalyticsDay(date: Date) {
  const parts = dayFormatter.formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value;

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function startOfAnalyticsDay(day: string) {
  const utcMidnight = Date.parse(`${day}T00:00:00Z`);
  const offset = offsetFormatter.formatToParts(new Date(utcMidnight)).find((part) => part.type === "timeZoneName")?.value;

  const match = offset?.match(/^GMT([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("Nepodařilo se určit časovou zónu.");
  }

  const offsetMinutes = (Number(match[2]) * 60 + Number(match[3])) * (match[1] === "-" ? -1 : 1);
  return new Date(utcMidnight - offsetMinutes * 60_000);
}

export function shiftAnalyticsDay(day: string, days: number) {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
