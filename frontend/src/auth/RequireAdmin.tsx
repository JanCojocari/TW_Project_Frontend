import { Navigate } from "react-router-dom";
import { useAuth }  from "./AuthContext.tsx";
import type { JSX } from "react";
import { paths }    from "../app/paths.ts";

// Role.Admin = 0, Role.Moderator = 3
const ADMIN_ROLE     = 0;
const MODERATOR_ROLE = 3;

export const RequireAdmin = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated) return <Navigate to={paths.login}    replace />;
    if (currentUser?.role !== ADMIN_ROLE && currentUser?.role !== MODERATOR_ROLE)
        return <Navigate to={paths.listings} replace />;

    return children;
};