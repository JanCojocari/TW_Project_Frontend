
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register";
export const publicRoutes = [
    {path: "/", element: <Login />},
    // {path: "/home", element: <Home/>},
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>}
];

export const privateRoutes = [
    {
        path: "/home",
        element: <Home/>, // <component_name/>
        role: "role",
    },
];