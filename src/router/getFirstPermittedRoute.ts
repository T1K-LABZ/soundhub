import { ROUTES } from "./routes";

type UserPermissions = Record<string, { view: boolean }>;

const ROUTE_PERMISSION_MAP: { route: string; permissionKey: string }[] = [
  { route: ROUTES.dashboard, permissionKey: "dashboard" },
  { route: ROUTES.products, permissionKey: "products" },
  { route: ROUTES.sales, permissionKey: "sales" },
  { route: ROUTES.invoices, permissionKey: "invoices" },
  { route: ROUTES.reports, permissionKey: "reports" },
  { route: ROUTES.staff, permissionKey: "staff" },
  { route: ROUTES.customers, permissionKey: "customers" },
  { route: ROUTES.inventory, permissionKey: "inventory" },
];

/**
 * Returns the first route the user has permission to view.
 * Falls back to login if no routes are accessible.
 */
export function getFirstPermittedRoute(permissions: UserPermissions): string {
  for (const { route, permissionKey } of ROUTE_PERMISSION_MAP) {
    if (permissions[permissionKey]?.view === true) {
      return route;
    }
  }
  return ROUTES.login;
}
