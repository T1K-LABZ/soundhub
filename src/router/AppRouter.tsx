import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { AuthGuard } from "../features/auth/AuthGuard";
import { LoginPage } from "../features/auth/LoginPage";
import { CustomersPage } from "../features/customers/CustomersPage";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { InventoryPage } from "../features/inventory/InventoryPage";
import { InvoicesPage } from "../features/invoices/InvoicesPage";
import { ProductsPage } from "../features/products/ProductsPage";
import { ReportsPage } from "../features/reports/ReportsPage";
import { SalesPage } from "../features/sales/SalesPage";
import { StaffPage } from "../features/staff/StaffPage";
import { ROUTES } from "./routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path={ROUTES.root} element={<MainLayout />}>
            <Route index element={<Navigate to={ROUTES.dashboard} replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="customers" element={<CustomersPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
