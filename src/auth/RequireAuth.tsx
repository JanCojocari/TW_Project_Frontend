import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type {JSX} from "react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    // Navigam automat la paginade login daca utilizatorul nu este logat
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};
