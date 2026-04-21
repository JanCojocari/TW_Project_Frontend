import { createContext, useContext, useEffect } from "react";
import type { AxiosInstance } from "axios";
import axiosInstance from "./axiosInstance";
import { tokenStore } from "../auth/tokenStore";

const AxiosContext = createContext<AxiosInstance>(axiosInstance);

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = tokenStore.get();

                if (token) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status;

                if (status === 401) {
                    tokenStore.clear();
                    sessionStorage.removeItem("rentora_user");
                    window.dispatchEvent(new Event("rentora:unauthorized"));
                }

                const isNetworkError = !error.response;
                const is5xx = status >= 500;

                if ((isNetworkError || is5xx) && window.location.pathname !== "/500") {
                    window.location.href = "/500";
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <AxiosContext.Provider value={axiosInstance}>
            {children}
        </AxiosContext.Provider>
    );
};

export const useAxios = (): AxiosInstance => {
    return useContext(AxiosContext);
};