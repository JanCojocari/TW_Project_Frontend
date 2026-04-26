// src/app/routes.tsx
import Home            from "../pages/Home";
import Login           from "../pages/Login";
import Register        from "../pages/Register";
import RoleSelection   from "../pages/RoleSelection";
import Dashboard       from "../pages/Dashboard";
import About           from "../pages/About";
import { paths }       from "./paths";
import Listings        from "../pages/Listings.tsx";
import ApartmentDetail from "../pages/ApartmentDetail.tsx";
import Support         from "../pages/Support";
import PaymentPage     from "../pages/Payment";
import CreateListing   from "../pages/CreateListing";
import Settings        from "../pages/Settings";
import ServerError     from "../pages/ServerError";
import AdminDashboard  from "../pages/AdminDashboard";

export const publicRoutes = [
    { path: paths.listings,              element: <Listings /> },
    { path: paths.serverError,           element: <ServerError /> },
    { path: paths.general,               element: <Listings /> },
    { path: paths.apartmentDetailRoute,  element: <ApartmentDetail /> },
    { path: paths.support,               element: <Support /> },
];

export const privateRoutes = [
    { path: paths.dashboard, element: <Dashboard /> },
    { path: paths.payment,   element: <PaymentPage /> },
    { path: paths.settings,  element: <Settings /> },
];

// Accesibile doar de Admin si Owner (nu Renter)
export const ownerRoutes = [
    { path: paths.createListing, element: <CreateListing /> },
    { path: paths.editListing,   element: <CreateListing /> },
];

export const adminRoutes = [
    { path: paths.admin, element: <AdminDashboard /> },
];

export const notAuthRoutes = [
    { path: paths.home,         element: <Home /> },
    { path: paths.login,        element: <Login /> },
    { path: paths.register,     element: <RoleSelection /> },
    { path: paths.registerForm, element: <Register /> },
    { path: paths.about,        element: <About /> },
];