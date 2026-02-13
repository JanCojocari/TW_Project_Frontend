import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";
import type {JSX} from "react";
import {paths} from "../app/paths.ts";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    // Navigam automat la paginade login daca utilizatorul nu este logat
    
    if (!isAuthenticated) {
        return <Navigate to={paths.login} replace />;
    }
    return children;
};
