// i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ro from "./ro";
import en from "./en";

const STORAGE_KEY = "rentora-lang";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            ro: { translation: ro },
            en: { translation: en },
        },
        lng:           localStorage.getItem(STORAGE_KEY) ?? "ro",
        fallbackLng:   "ro",
        interpolation: { escapeValue: false },
    });

export default i18n;