const CURRENCY_FORMATTER = new Intl.NumberFormat("yo-NG", {
  currency: "NGN",
  style: "currency",
});

export function formatCurrency(number: number) {
  return CURRENCY_FORMATTER.format(number);
}
