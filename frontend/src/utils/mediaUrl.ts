// utils/mediaUrl.ts
// Backend-ul returneaza URL-uri relative: /uploads/abc.png
// Browser-ul le rezolva relativ la frontend (localhost:5173), nu la backend (localhost:5231)
// Aceasta functie le face absolute.

const BACKEND_ORIGIN = "http://localhost:5231";

export function resolveMediaUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    // Daca e deja absolut (http/https), il lasam neschimbat
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // Altfel prefixam cu originea backend-ului
    return `${BACKEND_ORIGIN}${url}`;
}