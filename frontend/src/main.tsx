// main.tsx
import { StrictMode }           from "react";
import { createRoot }           from "react-dom/client";
import "./index.css";
import "./i18n";                             // inițializare i18next
import { AuthProvider }         from "./auth/AuthContext.tsx";
import { AppRouter }            from "./app/router.tsx";
import { RentoraThemeProvider } from "./theme/ThemeContext.tsx";
import { LanguageProvider }     from "./context/LanguageContext.tsx";
import { AxiosProvider }        from "./api/AxiosContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RentoraThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AxiosProvider>
                        <AppRouter />
                    </AxiosProvider>
                </AuthProvider>
            </LanguageProvider>
        </RentoraThemeProvider>
    </StrictMode>,
);