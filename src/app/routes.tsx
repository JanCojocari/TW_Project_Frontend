
import Home from "../pages/Home"
import Login from "../pages/Login";
export const publicRoutes = [
    {path: "/", element: <Login />},
    // {path: "/home", element: <Home/>},
    {path: "/login", element: <Login/>}
];

export const privateRoutes = [
    {
        path: "/home",
        element: <Home/>, // <component_name/>
        role: "role",
    },
];