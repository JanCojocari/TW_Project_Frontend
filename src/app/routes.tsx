import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import { paths } from "./paths";
import Listings from "../pages/Listings.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx"

// Trebuie de introdus rolul de chirias si de proprietar asa incat path-s sa se afiseze in dependenta de rol
export const publicRoutes = [
    { path: paths.dashboard, element: <Dashboard />},
    { path: paths.listings, element: <Listings /> },
    { path: paths.general, element: <Listings /> },

];

export const privateRoutes = [
    {
        path: paths.dashboard,
        element: <Dashboard />,
        role: "role",
    },
    { path: paths.apartmentDetailRoute, element: <ApartmentDetail /> },

];

export const notAuthRoutes = [
    { path: paths.home, element: <Home /> },
    { path: paths.login, element: <Login /> },
    { path: paths.register, element: <Register /> },
    { path: paths.about, element: <About /> },
];