// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAxios } from "../api/AxiosContext";
import { tokenStore } from "./tokenStore";
import type { UserApiDto } from "../services/userService";
import type { AxiosError } from "axios";

const STORAGE_KEY = "rentora_user";

type AuthContextType = {
    isAuthenticated:   boolean;
    isAdmin:           boolean;
    isModerator:       boolean;
    currentUser:       UserApiDto | null;
    login:             (email: string, password: string) => Promise<void>;
    logout:            () => void;
    updateCurrentUser: (patch: Partial<UserApiDto>) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const axios = useAxios();
    const [currentUser, setCurrentUser] = useState<UserApiDto | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem(STORAGE_KEY);
        if (rawUser) {
            setCurrentUser(JSON.parse(rawUser));
        }
    }, [axios]);

    useEffect(() => {
        const handleUnauthorized = () => {
            delete axios.defaults.headers.common["Authorization"];
            setCurrentUser(null);
        };
        window.addEventListener("rentora:unauthorized", handleUnauthorized);
        return () => window.removeEventListener("rentora:unauthorized", handleUnauthorized);
    }, [axios]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [currentUser]);

    const login = async (email: string, password: string) => {
        try {
            const res = await axios.post("/auth/login", { email, password });
            const { user, accessToken } = res.data;
            tokenStore.set(accessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            setCurrentUser(user);
        } catch (err) {
            const error = err as AxiosError;
            console.error("Login failed:", error.response?.data);
            throw error;
        }
    };

    const logout = () => {
        tokenStore.clear();
        delete axios.defaults.headers.common["Authorization"];
        setCurrentUser(null);
    };

    // Actualizeaza partial userul curent (ex: dupa schimbarea avatarului)
    const updateCurrentUser = (patch: Partial<UserApiDto>) => {
        setCurrentUser(prev => prev ? { ...prev, ...patch } : prev);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!currentUser,
                isAdmin:         currentUser?.role === 0,
                isModerator:     currentUser?.role === 3,
                currentUser,
                login,
                logout,
                updateCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};