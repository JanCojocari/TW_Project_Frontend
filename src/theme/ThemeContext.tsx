// theme/ThemeContext.tsx
// Context global pentru modul temei (light / dark).
// Persistat în localStorage — preferința supraviețuiește refresh-ului.

import {
    createContext, useContext, useMemo,
    useState, useCallback, type ReactNode,
} from "react";
import { ThemeProvider }       from "@mui/material/styles";
import CssBaseline             from "@mui/material/CssBaseline";
import type { PaletteMode }    from "@mui/material";
import { createRentoraTheme }  from "./theme";

const STORAGE_KEY = "rentora-theme-mode";

interface ThemeContextValue {
    mode:       PaletteMode;
    toggleMode: () => void;
    isDark:     boolean;
}

const ThemeCtx = createContext<ThemeContextValue>({
    mode:       "light",
    toggleMode: () => {},
    isDark:     false,
});

export function RentoraThemeProvider({ children }: { children: ReactNode }) {
    const [mode, setMode] = useState<PaletteMode>(() => {
        // Citim preferința salvată; fallback la 'light'
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved === "dark" || saved === "light") ? saved : "light";
    });

    const toggleMode = useCallback(() => {
        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem(STORAGE_KEY, next);
            return next;
        });
    }, []);

    // Tema se reconstruiește doar când mode-ul se schimbă
    const theme = useMemo(() => createRentoraTheme(mode), [mode]);

    return (
        <ThemeCtx.Provider value={{ mode, toggleMode, isDark: mode === "dark" }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeCtx.Provider>
    );
}

// Hook pentru acces rapid oriunde în aplicație
export function useThemeMode() {
    return useContext(ThemeCtx);
}