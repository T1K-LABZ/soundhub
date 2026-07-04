import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./auth.store";
import { getFirstPermittedRoute } from "../../router/getFirstPermittedRoute";

type Props = {
  permissionKey: string;
};

export function PermissionGuard({ permissionKey }: Props) {
  const permissions = useAuthStore((s) => s.user?.permissions ?? {});

  if (permissions[permissionKey]?.view !== true) {
    const redirectRoute = getFirstPermittedRoute(permissions);
    return <Navigate to={redirectRoute} replace />;
  }

  return <Outlet />;
}
