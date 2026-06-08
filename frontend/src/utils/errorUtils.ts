type ApiError = { response?: { data?: unknown } };

/** Returns response.data from an unknown axios error */
export function getResponseData(err: unknown): unknown {
    return (err as ApiError)?.response?.data ?? null;
}

/** Extracts a human-readable message from an unknown axios error */
export function getApiErrorMessage(err: unknown, fallback: string): string {
    const data = (err as ApiError)?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (typeof data === "object" && data !== null) {
        const rec = data as Record<string, unknown>;
        const msg = rec.message ?? rec.error;
        if (typeof msg === "string" && msg.trim()) return msg;
    }
    return fallback;
}
