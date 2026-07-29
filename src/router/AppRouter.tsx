import { lazy, Suspense } from "react";

const AdminApp = lazy(() => import("./AdminApp"));
const StorefrontApp = lazy(() =>
  import("../features/storefront/StorefrontApp").then((module) => ({
    default: module.StorefrontApp,
  })),
);

export function AppRouter() {
  const isAdminSurface =
    import.meta.env.VITE_APP_SURFACE === "admin" ||
    (import.meta.env.VITE_APP_SURFACE !== "storefront" &&
      window.location.hostname.startsWith("admin."));

  return (
    <Suspense fallback={null}>
      {isAdminSurface ? <AdminApp /> : <StorefrontApp />}
    </Suspense>
  );
}
