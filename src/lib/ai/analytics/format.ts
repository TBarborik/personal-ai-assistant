const numberFormatter = new Intl.NumberFormat("cs-CZ");
const currencyFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});
const percFormatter = new Intl.NumberFormat("cs-CZ", {
  style: "percent",
  maximumFractionDigits: 1,
});
const chartDateFormatter = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", timeZone: "UTC" });

export const formatNumber = (value: number | null) => (value === null ? "-" : numberFormatter.format(value));

export const formatUsd = (value: string | number | null) => (value === null ? "-" : currencyFormatter.format(Number(value)));

export const formatDuration = (value: number | null) => (value === null ? "-" : `${(value / 1_000).toLocaleString("cs-CZ", { maximumFractionDigits: 2 })} s`);

export const formatPerc = (value: number | null) => (value === null ? "-" : percFormatter.format(value));

export const formatChartDate = (value: string) => chartDateFormatter.format(new Date(`${value}T00:00:00Z`));
