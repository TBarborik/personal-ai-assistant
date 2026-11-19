const numberFormatter = Intl.NumberFormat("cs-CZ");
export const formatNumber = (value: number): string =>
  numberFormatter.format(value);
