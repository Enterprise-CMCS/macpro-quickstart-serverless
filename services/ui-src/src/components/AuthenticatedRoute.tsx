import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../libs/contextLib";

export default function AuthenticatedRoute({ component }: any) {
  const { pathname, search } = useLocation();
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? (
    component()
  ) : (
    <Navigate to={`/login?redirect=${pathname}${search}`} />
  );
}
