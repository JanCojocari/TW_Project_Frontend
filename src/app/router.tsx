import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import { RequireAuth } from "../auth/RequireAuth";
import App from "../App.tsx";

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route element={<App />}>
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
            </Route>
        </Routes>
    </BrowserRouter>
);
