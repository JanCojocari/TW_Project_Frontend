// pages/Dashboard.tsx — sidebar desktop + bottom nav mobile
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation }    from "react-i18next";
import {
    Avatar, Box, Typography, BottomNavigation, BottomNavigationAction, Paper,
    useMediaQuery, useTheme,
} from "@mui/material";
import type { Apartment }    from "../types/apartment.types";
import { useAuth }           from "../auth/AuthContext";
import { apartmentService }  from "../services/apartmentService";
import { favoriteService }   from "../services/favoriteService";
import { paymentHistoryService } from "../services/paymentHistoryService";
import { paths }             from "../app/paths";
import { gradients, colors } from "../theme/gradients";
import { useNotifications }  from "../context/NotificationContext";
import { ownerNotifications } from "../services/notificationService";
import { resolveMediaUrl }   from "../utils/mediaUrl";
import SidebarItem, { ALL_NAV, type NavKey } from "../components/dashboard/SidebarItem";
import PageHeading           from "../components/dashboard/PageHeading";
import DeleteListingDialog   from "../components/dashboard/DeleteListingDialog";
import ProfileTab       from "../components/dashboard/ProfileTab";
import MyListingsTab    from "../components/dashboard/MyListingsTab";
import PaymentsTab      from "../components/dashboard/paymentTab/PaymentsTab";
import FavoritesTab     from "../components/dashboard/FavoritesTab";
import UpcomingStaysTab  from "../components/dashboard/UpcomingStaysTab";
import PreviousStaysTab  from "../components/dashboard/PreviousStaysTab";
import RecentViewTab     from "../components/dashboard/RecentViewTab";

const SIDEBAR_W    = 130;
const NAVBAR_H     = 64;
const BOTTOM_NAV_H = 64;

// Role enum: Admin=0, Owner=1, Renter=2
const RENTER_ROLE = 2;

export default function Dashboard() {
    const { t }           = useTranslation();
    const { currentUser } = useAuth();
    const theme           = useTheme();
    const isMobile        = useMediaQuery(theme.breakpoints.down("md"));

    const isRenter = currentUser?.role === RENTER_ROLE;
    const { addNotification } = useNotifications();

    // Renter nu are tab "Proprietatile Mele"
    const NAV = isRenter
        ? ALL_NAV.filter(item => item.key !== "listings")
        : ALL_NAV;

    const [active, setActive] = useState<NavKey>(() => {
        const saved = localStorage.getItem("rentora_dash_tab") as NavKey | null;
        if (saved === "listings" && isRenter) return "profile";
        return saved ?? "profile";
    });

    const navigate        = useNavigate();
    const location        = useLocation();

    const currentUserId = currentUser?.id ?? 0;

    const [myListings, setMyListings]       = useState<Apartment[]>([]);
    const [allApartments, setAllApartments] = useState<Apartment[]>([]);
    const [favoriteIds, setFavoriteIds]     = useState<number[]>([]);

    const fetchListings = () => {
        if (!currentUserId) return;
        if (!isRenter) {
            apartmentService.getByOwner(currentUserId).then(setMyListings).catch(() => setMyListings([]));
        }
        apartmentService.getAll().then(setAllApartments).catch(() => setAllApartments([]));
        favoriteService.getByUser(currentUserId)
            .then(favs => setFavoriteIds(favs.map(f => f.apartmentId)))
            .catch(() => setFavoriteIds([]));
    };

    useEffect(() => { fetchListings(); }, [currentUserId]);

    // reseteaza tabul activ daca rolul nu permite "listings"
    useEffect(() => {
        if (isRenter && active === "listings") setActive("profile");
    }, [isRenter]);

    // re-fetch dupa redirect de la editare listing
    useEffect(() => {
        if ((location.state as { refreshListings?: boolean } | null)?.refreshListings) {
            fetchListings();
            navigate(paths.dashboard, { replace: true, state: {} });
        }
    }, [location.state]);

    // re-fetch cand userul revine pe acest tab
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") fetchListings();
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
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

    // ── Delete listing ────────────────────────────────────────────────────────
    const [deleteTarget, setDeleteTarget] = useState<Apartment | null>(null);
    const [deletebusy, setDeleteBusy]     = useState(false);
    const [snack, setSnack]               = useState<{ msg: string; sev: "success" | "error" } | null>(null);

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setDeleteBusy(true);
        try {
            await apartmentService.delete(deleteTarget.Id_Apartment);
            setMyListings(prev => prev.filter(a => a.Id_Apartment !== deleteTarget.Id_Apartment));
            ownerNotifications.listingDeleted(addNotification, deleteTarget.Address);
            setDeleteTarget(null);
            setSnack({ msg: t("dashboard.myListings.deleteSuccess"), sev: "success" });
        } catch (err: unknown) {
            const data = (err as { response?: { data?: unknown } })?.response?.data;
            const isActiveBooking =
                (typeof data === "object" && data !== null && (data as { message?: string })?.message?.toLowerCase().includes("booking")) ||
                (typeof data === "string" && data.toLowerCase().includes("booking"));
            const msg = isActiveBooking
                ? t("dashboard.myListings.deleteErrorActive")
                : t("dashboard.myListings.deleteError");
            setDeleteTarget(null);
            setSnack({ msg, sev: "error" });
        } finally {
            setDeleteBusy(false);
        }
    };

    // ── Edit listing ──────────────────────────────────────────────────────────
    const handleEdit = async (apt: Apartment) => {
        try {
            const payments = await paymentHistoryService.getByApartment(apt.Id_Apartment);
            const now = new Date();
            const hasOngoing = payments.some(p => {
                if (!p.rentedFrom || !p.rentedTo) return false;
                return new Date(p.rentedFrom) <= now && now <= new Date(p.rentedTo);
            });
            if (hasOngoing) {
                setSnack({ msg: t("dashboard.myListings.editErrorActive"), sev: "error" });
                return;
            }
        } catch {
            // daca requestul esueaza, permitem accesul — backend-ul va bloca oricum
        }
        navigate(paths.editListing, { state: { apartment: apt } });
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

                {active === "listings" && !isRenter && (
                    <>
                        <PageHeading title={t("dashboard.tabs.apartments")} />
                        <MyListingsTab
                            myListings={myListings}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={toggleFavorite}
                            getUserName={(id) => `User #${id}`}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
                        />
                    </>
                )}

                {active === "recent" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.recentViewed")} />
                        <RecentViewTab />
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

                {active === "previous" && (
                    <>
                        <PageHeading title={t("dashboard.tabs.previousStays")} />
                        <PreviousStaysTab />
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
                                    "& .MuiBottomNavigationAction-label": { fontSize: 10, fontWeight: 600, mt: 0.3, minHeight: 28, display: "flex", alignItems: "flex-start", justifyContent: "center" },
                                    "&.Mui-selected .MuiBottomNavigationAction-label": { fontSize: 10, fontWeight: 800 },
                                }}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}

            <DeleteListingDialog
                target={deleteTarget}
                busy={deletebusy}
                snack={snack}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDeleteConfirm}
                onSnackClose={() => setSnack(null)}
            />
        </Box>
    );
}
