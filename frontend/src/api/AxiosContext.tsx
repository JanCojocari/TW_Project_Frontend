import { createContext, useContext, useEffect } from "react";
import type { AxiosInstance } from "axios";
import axiosInstance from "./axiosInstance";

const AxiosContext = createContext<AxiosInstance>(axiosInstance);

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => config,
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error) => {
                const isNetworkError = !error.response;
                const is5xx = error.response?.status >= 500;

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
