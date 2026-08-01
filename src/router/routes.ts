export const ROUTES = {
  login: "/login",
  root: "/",
  dashboard: "/dashboard",
  products: "/products",
  inventory: "/inventory",
  sales: "/sales",
  orders: "/orders",
  reports: "/reports",
  invoices: "/invoices",
  staff: "/staff",
  customers: "/customers",
  changePassword: "/change-password",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
