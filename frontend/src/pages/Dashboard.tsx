// pages/Dashboard.tsx — sidebar desktop + bottom nav mobile
import { useEffect, useMemo, useState } from "react";
import { useNavigate }       from "react-router-dom";
import { useTranslation }    from "react-i18next";
import {
    Avatar, Box, Typography, BottomNavigation, BottomNavigationAction, Paper,
    useMediaQuery, useTheme,
} from "@mui/material";
import PersonIcon    from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaymentIcon   from "@mui/icons-material/Payment";
import FavoriteIcon  from "@mui/icons-material/Favorite";
import EventIcon     from "@mui/icons-material/Event";
import type { Apartment }    from "../types/apartment.types";
import { useAuth }           from "../auth/AuthContext";
import { apartmentService }  from "../services/apartmentService";
import { favoriteService }   from "../services/favoriteService";
import { paths }             from "../app/paths";
import { gradients, colors } from "../theme/gradients";
import { resolveMediaUrl }   from "../utils/mediaUrl";
import ProfileTab       from "../components/dashboard/ProfileTab";
import MyListingsTab    from "../components/dashboard/MyListingsTab";
import PaymentsTab      from "../components/dashboard/paymentTab/PaymentsTab";
import FavoritesTab     from "../components/dashboard/FavoritesTab";
import UpcomingStaysTab from "../components/dashboard/UpcomingStaysTab";

const SIDEBAR_W    = 130;
const NAVBAR_H     = 64;
const BOTTOM_NAV_H = 64;

type NavKey = "profile" | "listings" | "payments" | "favorites" | "upcoming";

interface NavItem { key: NavKey; labelKey: string; icon: React.ReactNode }

const NAV: NavItem[] = [
    { key: "profile",  labelKey: "dashboard.tabs.profile",        icon: <PersonIcon    sx={{ fontSize: 22 }} /> },
    { key: "listings", labelKey: "dashboard.tabs.apartments",      icon: <ApartmentIcon sx={{ fontSize: 22 }} /> },
    { key: "payments", labelKey: "dashboard.tabs.payments",        icon: <PaymentIcon   sx={{ fontSize: 22 }} /> },
    { key: "favorites",labelKey: "dashboard.tabs.favorites",       icon: <FavoriteIcon  sx={{ fontSize: 22 }} /> },
    { key: "upcoming", labelKey: "dashboard.tabs.upcomingStays",   icon: <EventIcon     sx={{ fontSize: 22 }} /> },
];

function SidebarItem({ item, isActive, onClick }: { item: NavItem; isActive: boolean; onClick: () => void }) {
    const { t } = useTranslation();
    return (
        <Box
            component="button"
            onClick={onClick}
            sx={{
                all: "unset",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                width: "100%",
                py: 1.5,
                cursor: "pointer",
                position: "relative",
                color: isActive ? "primary.main" : "text.disabled",
                transition: "color .15s",
                bgcolor: isActive ? colors.primaryAlpha06 : "transparent",
                "&:hover": { color: "primary.main", bgcolor: colors.primaryAlpha06 },
                "&::before": isActive ? {
                    content: '""',
                    position: "absolute",
                    left: 0, top: "20%", bottom: "20%",
                    width: 3,
                    borderRadius: "0 4px 4px 0",
                    background: gradients.primary,
                } : {},
            }}
        >
            {item.icon}
            <Typography sx={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.2,
                textAlign: "center",
                color: "inherit",
            }}>
                {t(item.labelKey)}
            </Typography>
        </Box>
    );
}

function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <Box sx={{ mb: { xs: 2, md: 4 } }}>
            <Typography sx={{
                fontSize: { xs: 18, md: 22 },
                fontWeight: 900,
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                background: gradients.textPrimary,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography sx={{ fontSize: { xs: 12, md: 13 }, color: "text.secondary", mt: 0.5 }}>
                    {subtitle}
                </Typography>
            )}
        </Box>
    );
}

export default function Dashboard() {
    const navigate        = useNavigate();
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const theme           = useTheme();
    const isMobile        = useMediaQuery(theme.breakpoints.down("md"));

    const [active, setActive] = useState<NavKey>(
        () => (localStorage.getItem("rentora_dash_tab") as NavKey) ?? "profile"
    );

    const currentUserId = currentUser?.id ?? 0;

    const [myListings, setMyListings]       = useState<Apartment[]>([]);
    const [allApartments, setAllApartments] = useState<Apartment[]>([]);
    const [favoriteIds, setFavoriteIds]     = useState<number[]>([]);

    useEffect(() => {
        if (!currentUserId) return;
        apartmentService.getByOwner(currentUserId).then(setMyListings).catch(() => setMyListings([]));
        apartmentService.getAll().then(setAllApartments).catch(() => setAllApartments([]));
        favoriteService.getByUser(currentUserId)
            .then(favs => setFavoriteIds(favs.map(f => f.apartmentId)))
            .catch(() => setFavoriteIds([]));
    }, [currentUserId]);

    const favoriteApartments = useMemo(() => {
        const set = new Set(favoriteIds);
        return allApartments.filter(a => set.has(a.Id_Apartment));
    }, [favoriteIds, allApartments]);

    const toggleFavorite = async (id: number) => {
        const isFav = favoriteIds.includes(id);
        setFavoriteIds(prev => isFav ? prev.filter(x => x !== id) : [...prev, id]);
        try {
            isFav
                ? await favoriteService.remove(currentUserId, id)
                : await favoriteService.add(currentUserId, id);
        } catch {
            setFavoriteIds(prev => isFav ? [...prev, id] : prev.filter(x => x !== id));
        }
    };

    const go = (key: NavKey) => {
        setActive(key);
        localStorage.setItem("rentora_dash_tab", key);
    };

    const initials = currentUser
        ? `${currentUser.name?.[0] ?? ""}${currentUser.surname?.[0] ?? ""}`.toUpperCase()
        : "U";

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
                <Box sx={{
                    width: SIDEBAR_W,
                    bgcolor: "background.paper",
                    borderRight: `1px solid ${colors.border}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    position: "sticky",
                    top: NAVBAR_H,
                    height: `calc(100vh - ${NAVBAR_H}px)`,
                    alignSelf: "flex-start",
                    flexShrink: 0,
                    zIndex: 900,
                    overflowY: "auto",
                    pt: 3,
                    pb: 2,
                }}>
                    <Avatar
                        src={resolveMediaUrl(currentUser?.avatarUrl)}
                        sx={{
                            width: 50, height: 50,
                            background: gradients.primary,
                            fontSize: 17, fontWeight: 700,
                            mb: 0.8,
                            border: `2px solid ${colors.primaryAlpha25}`,
                            boxShadow: `0 4px 14px ${colors.primaryAlpha25}`,
                        }}
                    >
                        {!currentUser?.avatarUrl && initials}
                    </Avatar>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", textAlign: "center", px: 1, lineHeight: 1.3, mb: 0.2 }}>
                        {currentUser?.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", textAlign: "center", px: 1, lineHeight: 1.3, mb: 3 }}>
                        {currentUser?.surname}
                    </Typography>

                    <Box sx={{ width: "60%", height: "1px", bgcolor: colors.border, mb: 2 }} />

                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.25, flex: 1 }}>
                        {NAV.map(item => (
                            <SidebarItem
                                key={item.key}
                                item={item}
                                isActive={active === item.key}
                                onClick={() => go(item.key)}
                            />
                        ))}
                    </Box>

                    <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 2 }}>
                        Rentora
                    </Typography>
                </Box>
            )}

            {/* Content */}
            <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, minWidth: 0 }}>

                {isMobile && (
                    <Box sx={{
                        display: "flex", alignItems: "center", gap: 1.5,
                        mb: 3, p: 2,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: `1px solid ${colors.border}`,
                    }}>
                        <Avatar
                            src={resolveMediaUrl(currentUser?.avatarUrl)}
                            sx={{ width: 42, height: 42, background: gradients.primary, fontSize: 14, fontWeight: 700 }}
                        >
                            {!currentUser?.avatarUrl && initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography fontSize={14} fontWeight={700} color="text.primary" lineHeight={1.2} noWrap>
                                {currentUser?.name} {currentUser?.surname}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary" lineHeight={1.4} noWrap>
                                {currentUser?.email}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {active === "profile" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.profile")} subtitle={t("dashboard.subtitle")} />
                        <ProfileTab currentUser={currentUser} onEditProfile={() => navigate(paths.settings)} />
                    </>
                )}

                {active === "listings" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.apartments")} />
                        <MyListingsTab
                            myListings={myListings}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                            getUserName={(id) => `User #${id}`}
                        />
                    </>
                )}

                {active === "payments" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.payments")} />
                        <PaymentsTab />
                    </>
                )}

                {active === "favorites" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.favorites")} />
                        <FavoritesTab
                            favoriteApartments={favoriteApartments}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                            getUserName={(id) => `User #${id}`}
                        />
                    </>
                )}

                {active === "upcoming" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.upcomingStays")} />
                        <UpcomingStaysTab />
                    </>
                )}
            </Box>

            {/* Bottom Navigation — doar mobile */}
            {isMobile && (
                <Paper elevation={8} sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900, borderTop: `1px solid ${colors.border}`, borderRadius: 0 }}>
                    <BottomNavigation
                        value={active}
                        onChange={(_, v) => go(v as NavKey)}
                        sx={{ height: BOTTOM_NAV_H, bgcolor: "background.paper", "& .Mui-selected": { color: "primary.main !important" } }}
                    >
                        {NAV.map(item => (
                            <BottomNavigationAction
                                key={item.key}
                                value={item.key}
                                label={t(item.labelKey)}
                                icon={item.icon}
                                sx={{
                                    minWidth: 0,
                                    color: "text.disabled",
                                    "& .MuiBottomNavigationAction-label": { fontSize: 10, fontWeight: 600, mt: 0.3 },
                                    "&.Mui-selected .MuiBottomNavigationAction-label": { fontSize: 10, fontWeight: 800 },
                                }}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}
        </Box>
    );
}