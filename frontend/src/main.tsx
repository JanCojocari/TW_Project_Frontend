// main.tsx
import { StrictMode }           from "react";
import { createRoot }           from "react-dom/client";
import "./index.css";
import "./i18n";                             // inițializare i18next
import { AuthProvider }         from "./auth/AuthContext.tsx";
import { AppRouter }            from "./app/router.tsx";
import { RentoraThemeProvider } from "./theme/ThemeContext.tsx";
import { LanguageProvider }     from "./context/LanguageContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RentoraThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppRouter />
                </AuthProvider>
            </LanguageProvider>
        </RentoraThemeProvider>
    </StrictMode>,
);