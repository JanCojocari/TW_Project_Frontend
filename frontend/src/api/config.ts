// api/config.ts
// Sursa unica pentru URL-ul backend — citit din env, fallback la localhost dev.

export const BACKEND_ORIGIN =
    import.meta.env.VITE_API_BASE_URL?.replace("/api", "") ?? "http://localhost:5231";
