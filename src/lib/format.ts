const numberFormatter = Intl.NumberFormat("cs-CZ");
export const formatNumber = (value: number): string =>
  numberFormatter.format(value);

export const formatTextToNormalize = (value: string): string => 
  value.normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  export const formatFileSize = (size: number): string => {
    if (size < 1_024) return `${size} B`;
    if (size < 1_024 ** 2) return `${(size / 1024).toFixed(1)} KB`;

    return `${(size / 1_024 ** 2).toFixed(1)} MB`;
  }