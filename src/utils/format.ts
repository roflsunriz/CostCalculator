const yenFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("ja-JP", {
  maximumFractionDigits: 2,
});

export const formatYen = (value: number) => yenFormatter.format(value);
export const formatNumber = (value: number) => numberFormatter.format(value);
