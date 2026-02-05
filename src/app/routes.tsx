
import Home from "../pages/Home"
export const publicRoutes = [
    {path: "/", element: <Home />},
    {path: "/home", element: <Home />},
];

export const privateRoutes = [
    {
        path: "/your_path",
        element: "component", // <component_name/>
        role: "role",
    },
];