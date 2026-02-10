
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register.tsx";
import {paths} from "./paths.ts"
import Listings from "../pages/Listings.tsx";
export const publicRoutes = [
    {path: "/*", element: <Home />},
    {path: paths.home, element: <Home/>},
    {path: paths.login, element: <Login/>},
    {path: paths.register, element: <Register/>},
    {path: paths.listings, element: <Listings/>}
    
];

export const privateRoutes = [
    {
        path: paths.home,
        element: <Home/>, // <component_name/>
        role: "role",
    },

];