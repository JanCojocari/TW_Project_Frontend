// context/LanguageContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import i18n from "../i18n";

const STORAGE_KEY = "rentora-lang";

type Lang = "ro" | "en";

interface LanguageContextValue {
    lang:       Lang;
    toggleLang: () => void;
    isEn:       boolean;
}

const LanguageCtx = createContext<LanguageContextValue>({
    lang:       "ro",
    toggleLang: () => {},
    isEn:       false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved === "en" ? "en" : "ro";
    });

    const toggleLang = useCallback(() => {
        const next: Lang = lang === "ro" ? "en" : "ro";
        setLang(next);
        i18n.changeLanguage(next);
        localStorage.setItem(STORAGE_KEY, next);
    }, [lang]);

    return (
        <LanguageCtx.Provider value={{ lang, toggleLang, isEn: lang === "en" }}>
            {children}
        </LanguageCtx.Provider>
    );
}

export function useLang() {
    return useContext(LanguageCtx);
}