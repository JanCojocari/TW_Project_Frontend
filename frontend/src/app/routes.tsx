import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import About from "../pages/About";
import { paths } from "./paths";
import Listings from "../pages/Listings.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Support from "../pages/Support";
import PaymentPage from "../pages/Payment";
import CreateListing from "../pages/CreateListing";
import Settings from "../pages/Settings";
import ServerError from "../pages/ServerError";
import AdminDashboard from "../pages/AdminDashboard";

export const publicRoutes = [
    { path: paths.listings,             element: <Listings /> },
    { path: paths.serverError,          element: <ServerError /> },
    { path: paths.general,              element: <Listings /> },
    { path: paths.apartmentDetailRoute, element: <ApartmentDetail /> }, // vizibil fara login
    { path: paths.support,              element: <Support /> },          // vizibil fara login
];

export const privateRoutes = [
    { path: paths.dashboard,     element: <Dashboard /> },
    { path: paths.payment,       element: <PaymentPage /> },
    { path: paths.createListing, element: <CreateListing /> },
    { path: paths.editListing,   element: <CreateListing /> }, // aceeasi componenta, mod edit
    { path: paths.settings,      element: <Settings /> },
];

export const adminRoutes = [
    { path: paths.admin, element: <AdminDashboard /> },
];

export const notAuthRoutes = [
    { path: paths.home,     element: <Home /> },
    { path: paths.login,    element: <Login /> },
    { path: paths.register, element: <Register /> },
    { path: paths.about,    element: <About /> },
];