export const ROUTES = {
  login: "/login",
  root: "/",
  dashboard: "/dashboard",
  products: "/products",
  inventory: "/inventory",
  sales: "/sales",
  reports: "/reports",
  invoices: "/invoices",
  staff: "/staff",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
