import { Navigate, Outlet, useLocation } from "react-router-dom";

export const AUTH_STORAGE_KEY = "talentmatch_authenticated";
export const CANDIDATE_STORAGE_KEY = "talentmatch_candidate_id";

export default function ProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem(AUTH_STORAGE_KEY) === "true" && localStorage.getItem(CANDIDATE_STORAGE_KEY);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
