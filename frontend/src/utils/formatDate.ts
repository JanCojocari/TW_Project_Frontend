// utils/formatDate.ts
// Utilitar centralizat pentru formatarea datelor in stil european (DD/MM/YYYY).
// Foloseste locale "ro-RO" sau "en-GB" — ambele produc DD/MM/YYYY.
// Toate componentele trebuie sa foloseasca aceste functii in loc de toLocaleDateString() direct.

import i18n from "../i18n";

function getLocale(): string {
    return i18n.language === "en" ? "en-GB" : "ro-RO";
}

// DD/MM/YYYY — ex: 24/04/2026
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(getLocale(), {
        day:   "2-digit",
        month: "2-digit",
        year:  "numeric",
    });
}

// D MMM YYYY — ex: 24 apr. 2026 / 24 Apr 2026
export function formatDateLong(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(getLocale(), {
        day:   "numeric",
        month: "long",
        year:  "numeric",
    });
}

// MMM YYYY — ex: apr. 2026 / Apr 2026 (pentru PaymentRow)
export function formatDateMonth(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(getLocale(), {
        month: "long",
        year:  "numeric",
    });
}

// D MMM — ex: 24 apr. (fara an, pentru review stay start)
export function formatDateShort(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(getLocale(), {
        day:   "numeric",
        month: "short",
    });
}