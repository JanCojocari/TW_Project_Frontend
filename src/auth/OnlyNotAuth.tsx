import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type {JSX} from "react";
import {paths} from "../app/paths.ts";

export const OnlyNotAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    // Navigam automat la paginade login daca utilizatorul nu este logat

    if (isAuthenticated) {
        return <Navigate to={paths.listings} replace />;
    }
    return children;
};
