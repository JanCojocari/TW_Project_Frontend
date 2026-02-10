import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import { paths } from "./paths";

export const publicRoutes = [
    { path: paths.home, element: <Home /> },
    { path: paths.login, element: <Login /> },
    { path: paths.register, element: <Register /> },
    { path: paths.dashboard, element: <Dashboard /> },
    
    { path: "*", element: <Home /> },
];

export const privateRoutes = [
    {
        path: paths.dashboard,
        element: <Dashboard />,
        role: "role",
    },
];