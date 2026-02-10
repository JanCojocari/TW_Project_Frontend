
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register.tsx";
import {paths} from "./paths.ts"
export const publicRoutes = [
    {path: "/*", element: <Login />},
    {path: paths.home, element: <Home/>},
    {path: paths.login, element: <Login/>},
    {path: paths.register, element: <Register/>}
    
];

export const privateRoutes = [
    {
        path: paths.home,
        element: <Home/>, // <component_name/>
        role: "role",
    },
];