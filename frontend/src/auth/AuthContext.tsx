import { createContext, useContext, useState } from "react";
import type { UserApiDto } from "../services/userService";

const STORAGE_KEY = "rentora_user";

function loadUser(): UserApiDto | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as UserApiDto) : null;
    } catch { return null; }
}

function saveUser(user: UserApiDto | null) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else       localStorage.removeItem(STORAGE_KEY);
}

type AuthContextType = {
    isAuthenticated: boolean;
    currentUser:     UserApiDto | null;
    login:           (user: UserApiDto) => void;
    logout:          () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<UserApiDto | null>(loadUser);

    const login = (user: UserApiDto) => {
        saveUser(user);
        setCurrentUser(user);
    };

    const logout = () => {
        saveUser(null);
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: currentUser !== null, currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
