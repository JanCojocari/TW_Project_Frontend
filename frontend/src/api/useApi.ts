import { useState, useCallback } from "react";
import { useAxios } from "./AxiosContext";
import type { AxiosRequestConfig } from "axios";

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useApi<T = unknown>() {
    const axios = useAxios();
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const request = useCallback(
        async (config: AxiosRequestConfig): Promise<T | null> => {
            setState({ data: null, loading: true, error: null });
            try {
                const response = await axios.request<T>(config);
                setState({ data: response.data, loading: false, error: null });
                return response.data;
            } catch (err: unknown) {
                const message =
                    err instanceof Error ? err.message : "A apărut o eroare";
                setState({ data: null, loading: false, error: message });
                return null;
            }
        },
        [axios]
    );

    return { ...state, request };
}
