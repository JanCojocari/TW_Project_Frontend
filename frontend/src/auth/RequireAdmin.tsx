import { Navigate } from "react-router-dom";
import { useAuth }  from "./AuthContext.tsx";
import type { JSX } from "react";
import { paths }    from "../app/paths.ts";

// Role.Admin = 0 in backend enum
const ADMIN_ROLE = 0;

export const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated)               return <Navigate to={paths.login}    replace />;
    if (currentUser?.role !== ADMIN_ROLE) return <Navigate to={paths.listings} replace />;

    return children;
};
