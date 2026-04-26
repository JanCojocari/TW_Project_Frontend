// src/app/paths.ts
export const paths = {
    home:                "/",
    login:               "/login",
    register:            "/register",           // RoleSelection
    registerForm:        "/register/form",      // formularul efectiv
    dashboard:           "/dashboard",
    about:               "/about",
    listings:            "/listings",
    general:             "*",
    apartmentDetailRoute:"/apartments/:id",
    apartmentDetail:     (id: number) => `/apartments/${id}`,
    editProfile:         "/dashboard/edit-profile",
    support:             "/support",
    payment:             "/payments",
    createListing:       "/createListing",
    editListing:         "/createListing/edit",
    settings:            "/settings",
    serverError:         "/500",
    admin:               "/admin",
} as const;
