import { Navigate } from "react-router-dom";
import { useAuth }  from "./AuthContext.tsx";
import type { JSX } from "react";
import { paths }    from "../app/paths.ts";

// Role.Renter = 2 in backend enum
const RENTER_ROLE = 2;

export const RequireOwner = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, currentUser } = useAuth();

    if (!isAuthenticated)                return <Navigate to={paths.login}    replace />;
    if (currentUser?.role === RENTER_ROLE) return <Navigate to={paths.listings} replace />;

    return children;
};