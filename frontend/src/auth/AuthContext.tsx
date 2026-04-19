// AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useAxios } from "../api/AxiosContext";
import type { UserApiDto } from "../services/userService";
import type { AxiosError } from "axios";

const STORAGE_KEY = "rentora_user";
const TOKEN_KEY   = "token";

type AuthContextType = {
    isAuthenticated: boolean;
    isAdmin:         boolean;
    currentUser:     UserApiDto | null;
    login:           (email: string, password: string) => Promise<void>;
    logout:          () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const axios = useAxios();
    const [currentUser, setCurrentUser] = useState<UserApiDto | null>(null);

    useEffect(() => {
        const rawUser = localStorage.getItem(STORAGE_KEY);
        const token   = localStorage.getItem(TOKEN_KEY);
        if (rawUser && token) {
            setCurrentUser(JSON.parse(rawUser));
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
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
            localStorage.setItem(TOKEN_KEY, accessToken);
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            setCurrentUser(user);
        } catch (err) {
            const error = err as AxiosError;
            console.error("Login failed:", error.response?.data);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        delete axios.defaults.headers.common["Authorization"];
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!currentUser,
                isAdmin:         currentUser?.role === 0, // 0 = Admin
                currentUser,
                login,
                logout,
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