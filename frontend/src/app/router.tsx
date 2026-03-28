import {BrowserRouter, Routes, Route, useNavigate} from "react-router-dom";
import {publicRoutes, privateRoutes, notAuthRoutes} from "./routes";
import {RequireAuth} from "../auth/RequireAuth";
import App from "../App.tsx";
import {OnlyNotAuth} from "../auth/OnlyNotAuth.tsx";
import ScrollToTop from "../components/general/ScrollToTop.tsx";
import { useEffect } from "react";
import { useAxios } from "../api/AxiosContext.tsx";
import { paths } from "./paths.ts";

const HealthCheck = () => {
    const axios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/health/check").catch(() => {
            navigate(paths.serverError);
        });
    }, []);

    return null;
};

export const AppRouter = () => (
    <BrowserRouter>
        <ScrollToTop />
        <HealthCheck />
        <Routes>
            <Route element={<App/>}>
                {publicRoutes.map((route) => (
                    <Route key={route.path} {...route} />
                ))}

                {privateRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <RequireAuth>
                                {route.element}
                            </RequireAuth>
                        }
                    />
                ))}

                {notAuthRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <OnlyNotAuth>
                                {route.element}
                            </OnlyNotAuth>
                        }
                    />
                ))}
            </Route>
        </Routes>
    </BrowserRouter>
);
