import {BrowserRouter, Routes, Route} from "react-router-dom";
import {publicRoutes, privateRoutes, notAuthRoutes} from "./routes";
import {RequireAuth} from "../auth/RequireAuth";
import App from "../App.tsx";
import {OnlyNotAuth} from "../auth/OnlyNotAuth.tsx";
import ScrollToTop from "../components/ScrollToTop.tsx"

export const AppRouter = () => (
    <BrowserRouter>
        <ScrollToTop />
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
