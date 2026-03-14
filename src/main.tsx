// main.tsx
import { StrictMode }              from "react";
import { createRoot }              from "react-dom/client";
import "./index.css";
import { AuthProvider }            from "./auth/AuthContext.tsx";
import { AppRouter }               from "./app/router.tsx";
import { RentoraThemeProvider }    from "./theme/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RentoraThemeProvider>
            <AuthProvider>
                <AppRouter />
            </AuthProvider>
        </RentoraThemeProvider>
    </StrictMode>,
);