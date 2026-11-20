const numberFormatter = Intl.NumberFormat("cs-CZ");
export const formatNumber = (value: number): string =>
  numberFormatter.format(value);

export const formatTextToNormalize = (value: string): string => 
  value.normalize("NFD")
    .replace(/\p{M}/gu, "")        // Odstranění diakritiky
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // Speciální znaky
    .replace(/\s+/g, " ")          // Vícenásobné mezery
    .trim();