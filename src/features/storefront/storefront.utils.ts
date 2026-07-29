export const storeId = import.meta.env.VITE_STOREFRONT_STORE_ID ?? "";

const currency = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});

export const money = (value: number | string) =>
  currency.format(Number(value || 0));
export const categoryOf = (product: {
  category?: string;
  categoryRef?: { name: string };
}) => product.categoryRef?.name ?? product.category ?? "";
