import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import { paths } from "./paths";
import Listings from "../pages/Listings.tsx";

export const publicRoutes = [
    { path: paths.dashboard, element: <Dashboard /> },
    { path: paths.listings, element: <Listings /> },
    { path: paths.general, element: <Listings /> },
];

export const privateRoutes = [
    {
        path: paths.dashboard,
        element: <Dashboard />,
        role: "role",
    },
];

export const notAuthRoutes = [
    { path: paths.home, element: <Home /> },
    { path: paths.login, element: <Login /> },
    { path: paths.register, element: <Register /> },
];