import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useMemo } from "react";
import { MainLayout } from "../components/layout/MainLayout";
import { AuthGuard } from "../features/auth/AuthGuard";
import { ChangePasswordPage } from "../features/auth/ChangePasswordPage";
import { LoginPage } from "../features/auth/LoginPage";
import { PermissionGuard } from "../features/auth/PermissionGuard";
import { useAuthStore } from "../features/auth/auth.store";
import { CustomersPage } from "../features/customers/CustomersPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { InventoryPage } from "../features/inventory/InventoryPage";
import { InvoicesPage } from "../features/invoices/InvoicesPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { SalesPage } from "../features/sales/SalesPage";
import { StaffPage } from "../features/staff/StaffPage";
import { ROUTES } from "./routes";
import { getFirstPermittedRoute } from "./getFirstPermittedRoute";

export default function AdminApp() {
  const user = useAuthStore((s) => s.user);
  const defaultRoute = useMemo(
    () => getFirstPermittedRoute(user?.permissions ?? {}),
    [user?.permissions],
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.changePassword} element={<ChangePasswordPage />} />
        <Route element={<AuthGuard />}>
          <Route path={ROUTES.root} element={<MainLayout />}>
            <Route index element={<Navigate to={defaultRoute} replace />} />
            <Route element={<PermissionGuard permissionKey="dashboard" />}>
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="customers" />}>
              <Route path="customers" element={<CustomersPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="products" />}>
              <Route path="products" element={<ProductsPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="inventory" />}>
              <Route path="inventory" element={<InventoryPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="sales" />}>
              <Route path="sales" element={<SalesPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="invoices" />}>
              <Route path="invoices" element={<InvoicesPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="reports" />}>
              <Route path="reports" element={<ReportsPage />} />
            </Route>
            <Route element={<PermissionGuard permissionKey="staff" />}>
              <Route path="staff" element={<StaffPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
