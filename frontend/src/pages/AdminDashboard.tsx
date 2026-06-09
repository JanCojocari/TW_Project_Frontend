// pages/AdminDashboard.tsx
import { useState }       from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon    from "@mui/icons-material/People";
import PaymentIcon   from "@mui/icons-material/Payment";
import StarIcon      from "@mui/icons-material/Star";
import SupportIcon   from "@mui/icons-material/Support";
import { useTranslation } from "react-i18next";
import { useAuth }        from "../auth/AuthContext";
import PlatformTab, { type NavKey } from "../components/admin/PlatformTab";
import ListingsTab  from "../components/admin/ListingsTab";
import UsersTab     from "../components/admin/UsersTab";
import PaymentsTab  from "../components/admin/PaymentsTab";
import ReviewsTab   from "../components/admin/ReviewsTab";
import SupportTab   from "../components/admin/SupportTab";
import AdminSidebar,   { type AdminNavItem } from "../components/admin/AdminSidebar";
import AdminSubHeader  from "../components/admin/AdminSubHeader";
import AdminBottomNav  from "../components/admin/AdminBottomNav";

const NAVBAR_H     = 64;
const BOTTOM_NAV_H = 64;

export default function AdminDashboard() {
    const { t }                                 = useTranslation();
    const { currentUser, isAdmin, isModerator } = useAuth();
    const theme    = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const ALL_NAV: AdminNavItem[] = [
        { key: "dashboard", label: t("admin.nav.dashboard"), icon: <DashboardIcon sx={{ fontSize: 20 }} />, desc: t("admin.nav.descDashboard"), adminOnly: true },
        { key: "listings",  label: t("admin.nav.listings"),  icon: <ApartmentIcon sx={{ fontSize: 20 }} />, desc: t("admin.nav.descListings"),  adminOnly: true },
        { key: "users",     label: t("admin.nav.users"),     icon: <PeopleIcon    sx={{ fontSize: 20 }} />, desc: t("admin.nav.descUsers"),     adminOnly: true },
        { key: "payments",  label: t("admin.nav.payments"),  icon: <PaymentIcon   sx={{ fontSize: 20 }} />, desc: t("admin.nav.descPayments"),  adminOnly: true },
        { key: "reviews",   label: t("admin.nav.reviews"),   icon: <StarIcon      sx={{ fontSize: 20 }} />, desc: t("admin.nav.descReviews")  },
        { key: "support",   label: t("admin.nav.support"),   icon: <SupportIcon   sx={{ fontSize: 20 }} />, desc: t("admin.nav.descSupport")  },
    ];

    const NAV    = isAdmin ? ALL_NAV : ALL_NAV.filter(n => !n.adminOnly);
    const [active, setActive] = useState<NavKey>(isAdmin ? "dashboard" : "reviews");
    const current = NAV.find(n => n.key === active) ?? NAV[0];

    const roleLabel      = isModerator ? t("admin.roleModerator") : t("admin.roleAdmin");
    const dashboardTitle = isModerator ? t("admin.titleModerator") : t("admin.title");

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            bgcolor: "background.default",
            mt: `${NAVBAR_H}px`,
            pb: { xs: `${BOTTOM_NAV_H}px`, md: 0 },
        }}>
            {/* Sidebar — doar desktop */}
            {!isMobile && (
                <AdminSidebar
                    nav={NAV}
                    active={active}
                    onNavigate={setActive}
                    currentUser={currentUser}
                    roleLabel={roleLabel}
                />
            )}

            {/* Main area */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: `calc(100vh - ${NAVBAR_H}px)`, minWidth: 0 }}>
                <AdminSubHeader
                    current={current}
                    dashboardTitle={dashboardTitle}
                    isMobile={isMobile}
                    currentUser={currentUser}
                    onHome={() => setActive(NAV[0].key)}
                />

                <Box sx={{ p: { xs: 2, md: 4 }, flex: 1, overflowX: "auto" }}>
                    {active === "dashboard" && isAdmin && <PlatformTab onNavigate={setActive} />}
                    {active === "listings"  && isAdmin && <ListingsTab />}
                    {active === "users"     && isAdmin && <UsersTab />}
                    {active === "payments"  && isAdmin && <PaymentsTab />}
                    {active === "reviews"   && <ReviewsTab />}
                    {active === "support"   && <SupportTab />}
                </Box>
            </Box>

            {/* Bottom Navigation — doar mobile */}
            {isMobile && (
                <AdminBottomNav nav={NAV} active={active} onChange={setActive} />
            )}
        </Box>
    );
}
