export const paths = {
    home: "/",              
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    about: "/about",
    listings: "/listings",
    general:"*",
    apartmentDetailRoute: "/apartments/:id",
    apartmentDetail: (id: number) => `/apartments/${id}`,

} as const;
