import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import { RequireAuth } from "../auth/RequireAuth";

export const AppRouter = () => (
    <BrowserRouter>
        <Routes>
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
        </Routes>
    </BrowserRouter>
);
