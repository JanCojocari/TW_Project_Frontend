// pages/AdminDashboard.tsx
import { useState } from "react";
import {
    Box, Typography, Avatar, Breadcrumbs, Link,
    List, ListItemButton, ListItemIcon, ListItemText, Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon    from "@mui/icons-material/People";
import PaymentIcon   from "@mui/icons-material/Payment";
import StarIcon      from "@mui/icons-material/Star";
import SupportIcon   from "@mui/icons-material/Support";
import { gradients, colors } from "../theme/gradients";
import UsersTab    from "../components/admin/UsersTab";
import ListingsTab from "../components/admin/ListingsTab";
import SupportTab  from "../components/admin/SupportTab";
import ReviewsTab  from "../components/admin/ReviewsTab";
import PaymentsTab from "../components/admin/PaymentsTab";
import PlatformTab from "../components/admin/PlatformTab";
import { useAuth } from "../auth/AuthContext";


const SIDEBAR_W  = 240;
const NAVBAR_H   = 64; // inaltimea Header.tsx existent

type NavKey = "dashboard" | "listings" | "users" | "payments" | "reviews" | "support";

const NAV: { key: NavKey; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon sx={{ fontSize: 20 }} />, desc: "Statistici si metrici platforma" },
    { key: "listings",  label: "Listings",  icon: <ApartmentIcon sx={{ fontSize: 20 }} />, desc: "Gestioneaza anunturile" },
    { key: "users",     label: "Users",     icon: <PeopleIcon    sx={{ fontSize: 20 }} />, desc: "Gestioneaza utilizatorii" },
    { key: "payments",  label: "Payments",  icon: <PaymentIcon   sx={{ fontSize: 20 }} />, desc: "Istoric tranzactii" },
    { key: "reviews",   label: "Reviews",   icon: <StarIcon      sx={{ fontSize: 20 }} />, desc: "Recenzii utilizatori" },
    { key: "support",   label: "Support",   icon: <SupportIcon   sx={{ fontSize: 20 }} />, desc: "Cereri de suport" },
];

export default function AdminDashboard() {
    const [active, setActive] = useState<NavKey>("dashboard");
    const current = NAV.find(n => n.key === active)!;
    const { currentUser } = useAuth();


    return (
        // mt = inaltimea Header.tsx ca sa nu se suprapuna
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", mt: `${NAVBAR_H}px` }}>

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <Box sx={{
                width: SIDEBAR_W,
                bgcolor: "background.paper",
                borderRight: `1px solid ${colors.border}`,
                position: "fixed",
                top: NAVBAR_H,
                bottom: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                zIndex: 1100,
                overflowY: "auto",
            }}>
                {/* Admin badge */}
                <Box sx={{
                    px: 2.5, py: 2,
                    borderBottom: `1px solid ${colors.border}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}>
                    <Avatar sx={{
                        width: 34, height: 34,
                        background: gradients.primary,
                        fontSize: 13, fontWeight: 700,
                    }}>
                        {currentUser?.name?.[0]?.toUpperCase() ?? "A"}
                    </Avatar>
                    <Box>
                        <Typography fontSize={13} fontWeight={700} color="text.primary" lineHeight={1.2}>
                            {currentUser?.name} {currentUser?.surname}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary" lineHeight={1.4}>
                            Administrator
                        </Typography>
                    </Box>
                </Box>

                {/* Section label */}
                <Typography sx={{
                    px: 2.5, pt: 2.5, pb: 1,
                    fontSize: 10, fontWeight: 700,
                    color: "text.disabled",
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                }}>
                    Main Menu
                </Typography>

                {/* Nav items */}
                <List sx={{ px: 1.5, pb: 2, flex: 1 }}>
                    {NAV.map(item => {
                        const isActive = active === item.key;
                        return (
                            <ListItemButton
                                key={item.key}
                                selected={isActive}
                                onClick={() => setActive(item.key)}
                                sx={{
                                    borderRadius: 2,
                                    mb: 0.5,
                                    px: 1.5,
                                    py: 0.9,
                                    position: "relative",
                                    transition: "all 0.15s",
                                    color: isActive ? "primary.main" : "text.secondary",
                                    bgcolor: isActive ? colors.primaryAlpha10 : "transparent",
                                    "&:hover": {
                                        bgcolor: colors.primaryAlpha06,
                                        color: "primary.main",
                                    },
                                    "&.Mui-selected": {
                                        bgcolor: colors.primaryAlpha10,
                                        "&:hover": { bgcolor: colors.primaryAlpha10 },
                                    },
                                    // accent bar stanga
                                    "&.Mui-selected::before": {
                                        content: '""',
                                        position: "absolute",
                                        left: -6, top: "20%", bottom: "20%",
                                        width: 3,
                                        borderRadius: 99,
                                        background: gradients.primary,
                                    },
                                }}
                            >
                                <ListItemIcon sx={{
                                    color: "inherit",
                                    minWidth: 34,
                                    "& svg": { fontSize: 19 },
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontSize: 13.5,
                                        fontWeight: isActive ? 700 : 400,
                                        lineHeight: 1,
                                    }}
                                />
                            </ListItemButton>
                        );
                    })}
                </List>

                <Divider sx={{ borderColor: colors.border, mx: 2 }} />
                <Box sx={{ py: 2, textAlign: "center" }}>
                    <Typography fontSize={11} color="text.disabled">
                        Rentora Admin v1.0
                    </Typography>
                </Box>
            </Box>

            {/* ── Main area ────────────────────────────────────────────── */}
            <Box sx={{
                ml: `${SIDEBAR_W}px`,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: `calc(100vh - ${NAVBAR_H}px)`,
            }}>
                {/* Sub-header cu breadcrumb */}
                <Box sx={{
                    px: 4, py: 2,
                    borderBottom: `1px solid ${colors.border}`,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Box>
                        <Breadcrumbs sx={{ mb: 0.5, "& .MuiBreadcrumbs-separator": { color: "text.disabled" } }}>
                            <Link
                                underline="hover"
                                sx={{ fontSize: 12, color: "text.secondary", cursor: "pointer", fontWeight: 500 }}
                                onClick={() => setActive("dashboard")}
                            >
                                Admin
                            </Link>
                            <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}>
                                {current.label}
                            </Typography>
                        </Breadcrumbs>
                        <Typography
                            variant="h6"
                            fontWeight={800}
                            fontSize={18}
                            sx={{
                                background: gradients.textPrimary,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {current.label}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary" mt={0.3}>
                            {current.desc}
                        </Typography>
                    </Box>
                </Box>

                {/* Continut tab */}
                <Box sx={{ p: 4, flex: 1 }}>
                    {active === "dashboard" && <PlatformTab />}
                    {active === "listings"  && <ListingsTab />}
                    {active === "users"     && <UsersTab />}
                    {active === "payments"  && <PaymentsTab />}
                    {active === "reviews"   && <ReviewsTab />}
                    {active === "support"   && <SupportTab />}
                </Box>
            </Box>
        </Box>
    );
}